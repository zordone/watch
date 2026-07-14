import os from "node:os";
import { DOMParser } from "@xmldom/xmldom";
import { Request, Response } from "express";
import google from "googlethis";
import omit from "lodash/omit";
import { Genre, Type } from "@common/enums";
import { Item, NetworkInfo, ParsedImdbData } from "@common/types";
import { IMPORT_DIR } from "./config";
import { fetchImdbData } from "./imdb";
import { importCsv } from "./importCsv";
import { ItemInstance, ItemModel, Item_dontUpdateFields } from "./models";

const reImage = /\.(jpe?g|png|webp)\b/i;

const decode = (htmlString: string) =>
  new DOMParser().parseFromString(`<d>${htmlString}</d>`, "text/html").documentElement?.textContent;

const errorMessage = (err: unknown) => (err instanceof Error ? err.message : "Unknown error");

const removeAllItems = () =>
  ItemModel.remove({})
    .then(() => {
      console.log("[RemoveAllItems] All items removed.");
    })
    .catch((err: unknown) => {
      console.error("[RemoveAllItems]", err);
    });

const makeArray = <T>(value: T | T[]): T[] => {
  if (Array.isArray(value)) {
    return value;
  }
  return value ? [value] : [];
};

const search = (query: string, { site, limit = 100 }: { site?: string; limit?: number } = {}) => {
  query += site ? ` site:${site}` : "";
  return google
    .image(query, {
      safe: false,
      additional_params: {
        tbs: "isz:m", // image size: medium
        imgar: "t", // aspect ratio: tall
        imgsz: "vga", // image size min: vga (640x480), svga (800x600), xga (1024x768), 2mp, 4mp, ...
      },
    })
    .then((images) => images.slice(0, limit))
    .catch((err: unknown) => {
      console.error("[SearchImages] Error:", err);
      return [];
    });
};

export const adminImport = (_req: Request, res: Response) => {
  let done = 0;
  let errors = 0;
  const filename = `${IMPORT_DIR}/import.csv`;
  const saveItem = (model: ItemInstance) =>
    model
      .save()
      .then(() => {
        done += 1;
      })
      .catch((err: unknown) => {
        console.log("[AdminImport] Item to save", model);
        console.error("[AdminImport] Item is not saved.", err);
        errors += 1;
      });
  removeAllItems()
    .then(() => {
      console.log("[AdminImport] Database cleared.");
      return importCsv(filename);
    })
    .then((models) => Promise.all(models.map(saveItem)))
    .then(() => {
      console.log("[AdminImport] Import finished. Done:", done, "Errors:", errors);
      res.sendStatus(200);
    })
    .catch((err: unknown) => {
      console.error("[AdminImport]", err);
      res.sendStatus(500);
    });
};

export const listItems = (_req: Request, res: Response) => {
  ItemModel.find()
    .then((items) => {
      console.log(`[ListItems] Found: ${items.length}`);
      res.send(items);
    })
    .catch((err: unknown) => {
      console.error("[ListItems]", err);
      res.status(500).send(errorMessage(err));
    });
};

export const newItem = (req: Request, res: Response) => {
  const body = omit(req?.body ?? {}, Item_dontUpdateFields);
  const now = new Date();
  const model = new ItemModel({
    ...body,
    created: now,
    updated: now,
  });
  model.save((err, saved) => {
    if (err) {
      console.error("[NewItem] Item is not saved.", err);
      res.status(400).send(err.message);
    } else {
      console.log("[NewItem] Item is saved. ID:", saved.id);
      res.setHeader("Location", `/items/${saved.id}`);
      res.send(saved);
    }
  });
};

export const getItemById = (req: Request, res: Response) => {
  const { id } = req.params;
  ItemModel.findById(id)
    .then((item) => {
      if (!item) {
        console.log("[GetItemById] Not found.");
        res.sendStatus(404);
        return;
      }
      console.log("[GetItemById] Found.");
      res.send(item);
    })
    .catch((err: unknown) => {
      console.error("[GetItemById]", err);
      res.status(500).send(errorMessage(err));
    });
};

export const updateItemById = (req: Request, res: Response) => {
  const { id } = req.params;
  const body: Partial<Item> = omit(req.body ?? {}, Item_dontUpdateFields);
  body.updated = new Date();
  ItemModel.findById(id)
    .then((item) => {
      if (!item) {
        console.log("[UpdateItemById] Not found.");
        return res.sendStatus(404);
      }
      item.set(body);
      item.save((err, saved) => {
        if (err) {
          console.error("[UpdateItemById] Item is not updated.", err);
          res.status(500).send(err.message);
        } else {
          console.log("[UpdateItemById] Item is updated.");
          res.send(saved);
        }
      });
      return undefined;
    })
    .catch((err: unknown) => {
      console.error("[UpdateItemById]", err);
      res.status(500).send(errorMessage(err));
    });
};

export const deleteItemById = (req: Request, res: Response) => {
  const { id } = req.params;
  ItemModel.deleteOne({ _id: id })
    .then(() => {
      console.log("[DeleteItemById] Deleted:", id);
      res.sendStatus(200);
    })
    .catch((err: unknown) => {
      console.error("[DeleteItemById]", err);
      res.sendStatus(404);
    });
};

export const searchImages = (req: Request, res: Response) => {
  const { query } = req.params;
  console.log("[SearchImages] Search:", query);
  Promise.all([
    search(`${JSON.stringify(query)}`, { site: "imdb.com", limit: 10 }),
    search(`${JSON.stringify(query)}`, { site: "themoviedb.org", limit: 10 }),
    search(`${JSON.stringify(query)} poster`),
  ])
    .then((...imageArrays) => {
      const images = imageArrays.flat(2);
      console.log("[SearchImages] Found:", images.length);
      const filtered = images
        // width & height are reversed here
        .filter(({ url, width: height, height: width }) => {
          const isImage = reImage.test(url);
          const isValidSize = width >= 640 && width <= 1920;
          const ratio = width / height;
          const isValidRatio = ratio >= 0.5 && ratio < 1;
          return isImage && isValidSize && isValidRatio;
        })
        .map((image) => image.url);
      console.log("[SearchImages] Filtered:", filtered.length);
      const unique = [...new Set(filtered)];
      console.log("[SearchImages] Unique:", unique.length);
      res.send(unique);
    })
    .catch((err: unknown) => {
      console.log("[SearchImages]", err);
      res.status(500).send(errorMessage(err));
    });
};

export const imdbData = (req: Request, res: Response) => {
  const { imdbId } = req.params;
  console.log("[ImdbData] IMDb ID:", imdbId);
  fetchImdbData(imdbId)
    .then((data) => {
      const result: ParsedImdbData = {
        parsed: {
          type: data["@type"] === "TVSeries" ? Type.SHOW : Type.MOVIE,
          title: decode(data.alternateName ?? data.name ?? "") ?? "",
          genres: makeArray(data.genre)
            .map((genre) => genre.toLowerCase() as Genre)
            .filter((genre) => {
              const isValid = Object.values(Genre).includes(genre);
              if (!isValid) {
                console.warn("[ImdbData] Invalid genre:", genre);
              }
              return isValid;
            }),
          description: decode(data.description ?? "") ?? "",
          keywords: (data.keywords ?? "")
            .split(",")
            .map((keyword) => keyword.trim().toLowerCase())
            .filter(Boolean),
          posterUrl: data.image ?? "",
          released: data.datePublished ? data.datePublished : "",
          releaseYear: data.datePublished ? parseInt(data.datePublished.slice(0, 4), 10) : null,
        },
        // these are not used yet
        extra: {
          rating: data.aggregateRating?.ratingValue ?? "",
          ratingCount: (data.aggregateRating?.ratingCount ?? 0).toString(),
        },
      };
      res.send(result);
    })
    .catch((err: unknown) => {
      console.log("[ImdbData]", err);
      res.status(500).send(errorMessage(err));
    });
};

export const localIp = (_req: Request, res: Response) => {
  const ip =
    Object.values(os.networkInterfaces())
      .flat()
      .find((net) => net?.family === "IPv4" && !net.internal)?.address ?? "";
  const result: NetworkInfo = { ip };
  res.send(result);
};
