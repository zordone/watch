import { ErrorOutline } from "@mui/icons-material";
import { Box } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { ItemLoadingFlag } from "@common/enums";
import { ParsedItem } from "@common/types";
import { noop } from "../service/utils";
import { actions } from "../store/store";
import { ItemIcon } from "./ItemIcon";
import { ScrapeButton } from "./ScrapeButton";
import "./Poster.css";

interface PosterProps {
  item: ParsedItem;
  posterSearching?: boolean;
  onPosterSearch?: () => void;
}

export const Poster = ({ item, onPosterSearch = noop, posterSearching = false }: PosterProps) => {
  const [state, setState] = useState("empty");

  // when the URL changes, reset state and start loading
  useEffect(() => {
    if (!item.posterUrl) {
      setState("empty");
      return;
    }
    setState("loading");
    actions.setItemLoadingFlag(ItemLoadingFlag.POSTER, !!item.posterUrl);
  }, [item.posterUrl]);

  const onLoaded = useCallback(() => {
    setState("loaded");
    actions.setItemLoadingFlag(ItemLoadingFlag.POSTER, false);
  }, []);

  const onError = useCallback(() => {
    setState("failed");
    actions.setItemLoadingFlag(ItemLoadingFlag.POSTER, false);
  }, []);

  return (
    <Box className="Poster" sx={{ boxShadow: 2 }}>
      {state === "empty" && <ItemIcon className="Poster-fallback" item={item} />}
      {state === "failed" && <ErrorOutline className="Poster-fallback" />}
      {item.posterUrl && !["empty", "failed"].includes(state) && (
        <img
          src={item.posterUrl}
          alt="Poster"
          className={`Poster-image ${state}`}
          onLoad={onLoaded}
          onError={onError}
          draggable="false"
        />
      )}
      <ScrapeButton
        className="Poster-search"
        ariaLabel="Poster search"
        inProgress={posterSearching}
        onClick={onPosterSearch}
      />
    </Box>
  );
};
