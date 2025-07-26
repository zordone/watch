declare global {
  interface DocumentEventMap {
    imdbPaste: CustomEvent<{ imdbId: string }>;
    imdbScrape: CustomEvent;
  }
}

export type ImdbPasteEventHandler = (event: DocumentEventMap["imdbPaste"]) => void;
