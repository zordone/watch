import { CloudDownload } from "@mui/icons-material";
import { Box, Paper } from "@mui/material";
import { useState, useCallback } from "react";
import { noop } from "../service/utils";
import "./PosterSearch.css";

interface PosterSearchProps {
  visible?: boolean;
  searching?: boolean;
  images?: string[];
  onSelect?: (url: string) => void;
}

export const PosterSearch = ({
  visible = true,
  searching = false,
  images = [],
  onSelect = noop,
}: PosterSearchProps) => {
  const [failedUrls, setFailedUrls] = useState<string[]>([]);

  const onFailedImage = useCallback((event: React.SyntheticEvent<HTMLImageElement>) => {
    const url = event.currentTarget.src;
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
