const { useMediaQuery } = require("@mui/material");

// returns { isMobile: boolean, isDesktop: boolean } depending on media query
export const useIsMobile = () => {
  const isMobile = useMediaQuery("(max-width: 640px)");
  return { isMobile, isDesktop: !isMobile };
};
