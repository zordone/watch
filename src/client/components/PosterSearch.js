import React, { useState, useCallback } from "react";
import PropTypes from "prop-types";
import { Paper } from "@mui/material";
import { CloudDownload } from "@mui/icons-material";
import { noop } from "../service/utils";
import "./PosterSearch.css";

const PosterSearch = ({ visible = true, searching = false, images = [], onSelect = noop }) => {
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
            <button
              key={image}
              type="button"
              className="PosterSearch-poster"
              onClick={() => onSelect(image)}
            >
              <img src={image} alt="Poster" onError={onFailedImage} />
            </button>
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

export default PosterSearch;
