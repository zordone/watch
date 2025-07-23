import React, { useCallback, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Box } from "@mui/material";
import { ErrorOutline } from "@mui/icons-material";
import { ItemLoadingFlags, ItemType } from "../../common/enums";
import ItemIcon from "./ItemIcon";
import ScrapeButton from "./ScrapeButton";
import { noop } from "../service/utils";
import { actions } from "../store/store";
import "./Poster.css";

const Poster = ({ item, onPosterSearch = noop, posterSearching = false }) => {
  const [state, setState] = useState("empty");

  useEffect(() => {
    if (!item.posterUrl) {
      setState("empty");
      return;
    }
    setState("loading");
    actions.setItemLoadingFlag(ItemLoadingFlags.POSTER, !!item.posterUrl);
  }, [item.posterUrl]);

  const onLoaded = useCallback(() => {
    setState("loaded");
    actions.setItemLoadingFlag(ItemLoadingFlags.POSTER, false);
  }, []);

  const onError = useCallback(() => {
    setState("failed");
    actions.setItemLoadingFlag(ItemLoadingFlags.POSTER, false);
  }, []);

  return (
    <Box className="Poster" sx={{ boxShadow: 2 }}>
      {state === "empty" && <ItemIcon className="Poster-fallback" item={item} />}
      {state === "failed" && (
        <span className="Poster-fallback">
          <ErrorOutline item={item} />
        </span>
      )}
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

Poster.propTypes = {
  item: PropTypes.shape({
    type: PropTypes.oneOf(Object.values(ItemType)),
    posterUrl: PropTypes.string,
  }).isRequired,
  posterSearching: PropTypes.bool,
  onPosterSearch: PropTypes.func,
};

export default Poster;
