import { CloudDownload } from "@mui/icons-material";
import { Box, Paper } from "@mui/material";
import PropTypes from "prop-types";
import { useState, useCallback } from "react";
import { noop } from "../service/utils";
import "./PosterSearch.css";

export const PosterSearch = ({
  visible = true,
  searching = false,
  images = [],
  onSelect = noop,
}) => {
  const [failedUrls, setFailedUrls] = useState([]);

  const onFailedImage = useCallback((event) => {
    const url = event.target.attributes.src.value;
    setFailedUrls((prevFailedUrls) => [...prevFailedUrls, url]);
  }, []);

  if (!visible) {
    return null;
  }

  const filteredImages = images.filter((image) => !failedUrls.includes(image));

  return (
    <Paper className="PosterSearch">
      {searching && (
        <div className="PosterSearch-searching">
          <div className="PosterSearch-searching-bg" />
          <CloudDownload />
          <span>Searching for poster images...</span>
        </div>
      )}
      {!searching && filteredImages.length === 0 && (
        <div className="PosterSearch-notfound">No suitable posters found.</div>
      )}
      {!searching && filteredImages.length > 0 && (
        <div className="PosterSearch-images">
          {filteredImages.map((image) => (
            <Box
              component="button"
              key={image}
              type="button"
              className="PosterSearch-poster"
              onClick={() => onSelect(image)}
              title={image}
              sx={{ boxShadow: 2, ":hover": { boxShadow: 8 } }}
            >
              <img src={image} alt="Poster" onError={onFailedImage} draggable="false" />
            </Box>
          ))}
          <div className="PosterSearch-fade left" />
          <div className="PosterSearch-fade right" />
        </div>
      )}
    </Paper>
  );
};

PosterSearch.propTypes = {
  visible: PropTypes.bool,
  searching: PropTypes.bool,
  images: PropTypes.arrayOf(PropTypes.string),
  onSelect: PropTypes.func,
};
