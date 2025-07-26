import { createTheme, ThemeProvider } from "@mui/material/styles";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useEffect } from "react";
import { createBrowserRouter, RouterProvider } from "react-router";
import { Help } from "./Help";
import { Home } from "./Home";
import { Item } from "./Item";
import { SnackPack } from "./SnackPack";
import "./App.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
    mutations: {
      retry: 1,
    },
  },
});

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#00a9ff",
      dark: "#008fd7",
      contrastText: "#000",
    },
    secondary: {
      main: "#cccccc",
      dark: "#aaaaaa",
      contrastText: "#000",
    },
    warning: {
      main: "#ff9500",
      dark: "#cb7700",
      contrastText: "#000",
    },
  },
  components: {
    MuiPaper: {
      defaultProps: {
        elevation: 24,
      },
    },
  },
});

const router = createBrowserRouter([
  { path: "/", Component: Home },
  { path: "/item/:id", Component: Item },
  { path: "/item/:id/:imdbId", Component: Item },
  { path: "/help", Component: Help },
]);

const reImdbId = /^tt\d{6,10}$/;

export const App = () => {
  // add/remove global listeners for native paste event
  useEffect(() => {
    const onPaste = (event: ClipboardEvent) => {
      const text = event.clipboardData?.getData("Text") ?? "";
      if (reImdbId.exec(text)) {
        const imdbPasteEvent = new CustomEvent("imdbPaste", { detail: { imdbId: text } });
        document.dispatchEvent(imdbPasteEvent);
      }
    };

    document.addEventListener("paste", onPaste);

    return () => {
      document.removeEventListener("paste", onPaste);
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <div className="App">
          <RouterProvider router={router} />
        </div>
        <SnackPack />
      </ThemeProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};
