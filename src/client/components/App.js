import React, { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import events, { Events } from "../service/events";
import Home from "./Home";
import Item from "./Item";
import Help from "./Help";
import "./App.css";

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

const AppRoutes = () => (
  <div className="App">
    <Routes>
      <Route exact path="/" element={<Home />} />
      <Route exact path="/item/:id" element={<Item />} />
      <Route exact path="/item/:id/:imdbId" element={<Item />} />
      <Route exact path="/help" element={<Help />} />
    </Routes>
  </div>
);

const App = () => {
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
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
