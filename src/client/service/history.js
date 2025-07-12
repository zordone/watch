import { createBrowserHistory } from "history";

// Create a fallback history for when router history is not available
const fallbackHistory = createBrowserHistory();

// This will be set by the router when available
let routerHistory = null;

export const setRouterHistory = (history) => {
  routerHistory = history;
};

export const getHistory = () => routerHistory || fallbackHistory;

export const updateHash = (search) => {
  const history = getHistory();
  const { location } = history;

  const newHash = search ? `#${encodeURIComponent(search)}` : "";
  if (location.hash === newHash) return;

  history.replace({
    pathname: location.pathname,
    search: location.search,
    hash: newHash,
  });
};
