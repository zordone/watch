/* globals document,CustomEvent */

export const Events = Object.freeze({
  PASTE: "paste",
  KEYUP: "keyup",
  KEYDOWN: "keydown",
  IMDB_PASTE: "imdbPaste",
  IMDB_SCRAPE: "imdbScrape",
});

const validateEvent = (event) => {
  if (!Object.values(Events).includes(event)) {
    throw new Error(`Invalid event: ${event}`);
  }
};

export default {
  addListener(event, handler) {
    validateEvent(event);
    document.addEventListener(event, handler);
  },
  removeListener(event, handler) {
    validateEvent(event);
    document.removeEventListener(event, handler);
  },
  dispatch(event, detail) {
    validateEvent(event);
    const customEvent = new CustomEvent(event, detail ? { detail } : undefined);
    document.dispatchEvent(customEvent);
  },
};
