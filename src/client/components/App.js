import React, { useEffect } from "react";
import { BrowserRouter, Route, Switch, useHistory } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Home from "./Home";
import Item from "./Item";
import Help from "./Help";
import events, { Events } from "../service/events";
import { setRouterHistory } from "../service/history";
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

const AppRoutes = () => {
  const history = useHistory();

  useEffect(() => {
    setRouterHistory(history);
  }, [history]);

  return (
    <div className="App">
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/item/:id/:imdbId?" component={Item} />
        <Route exact path="/help" component={Help} />
      </Switch>
    </div>
  );
};

const App = () => {
  useEffect(() => {
    // handle global imdb id pasting
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
