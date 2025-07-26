import { Schema, model } from "mongoose";
import { Type, Next, Vali, Finished, Rating, Genre } from "@common/enums";
import { Item } from "@common/types";

const itemSchema = new Schema<Item>({
  title: { type: String, required: true },
  type: { type: String, required: true, enum: Object.values(Type) },
  genres: [{ type: String, enum: Object.values(Genre) }],
  finished: { type: String, enum: Object.values(Finished) },
  lastWatched: { type: Number },
  inProgress: { type: Number },
  nextDate: { type: Date },
  nextType: { type: String, enum: Object.values(Next) },
  withVali: { type: String, enum: Object.values(Vali) },
  rating: { type: String, enum: Object.values(Rating) },
  description: { type: String },
  keywords: [{ type: String }],
  notes: { type: String },
  imdbId: { type: String },
  posterUrl: { type: String },
  releaseYear: { type: Number },
  created: { type: Date, required: true },
  updated: { type: Date, required: true },
});

export const ItemModel = model<Item>("Item", itemSchema);

export type ItemInstance = InstanceType<typeof ItemModel>;

export const Item_dontUpdateFields = ["_id", "__v", "created", "updated"];
