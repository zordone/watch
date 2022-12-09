import { createBrowserHistory } from "history";

export const history = createBrowserHistory();

export const updateHash = (search) => {
  const hash = search ? `#${encodeURIComponent(search)}` : "";
  history.replace(hash);
};
