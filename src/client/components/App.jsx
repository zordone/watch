import { createTheme, ThemeProvider } from "@mui/material/styles";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useEffect } from "react";
import { createBrowserRouter, RouterProvider } from "react-router";
import { events, Events } from "../service/events";
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
    default: {
      main: "#aaaaaa",
      dark: "#8a8a8a",
      contrastText: "#000",
    },
    primary: {
      main: "#00a9ff",
      dark: "#008fd7",
      contrastText: "#000",
    },
    secondary: {
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

export const App = () => {
  // handle global imdb id pasting
  useEffect(() => {
    const onPaste = (event) => {
      const text = event.clipboardData.getData("Text") || "";
      if (text.match(/^tt\d{6,10}$/)) {
        events.dispatch(Events.IMDB_PASTE, { imdbId: text });
      }
    };

    events.addListener(Events.PASTE, onPaste);

    return () => {
      events.removeListener(Events.PASTE, onPaste);
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
