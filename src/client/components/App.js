import React, { Component } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import MuiThemeProvider from "@material-ui/core/styles/MuiThemeProvider";
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import Home from "./Home";
import Item from "./Item";
import Help from "./Help";
import events, { Events } from "../service/events";
import { history } from "../service/history";
import "./App.css";

const theme = createMuiTheme({
  palette: {
    type: "dark",
    primary: {
      main: "#00a9ff",
    },
    secondary: {
      main: "#ff9500",
    },
  },
  typography: {
    fontFamily: "Roboto,Arial,sans-serif",
  },
});

class App extends Component {
  componentWillMount() {
    events.addListener(Events.PASTE, this.onPaste);
  }

  componentWillUnmount() {
    events.removeListener(Events.PASTE, this.onPaste);
  }

  // handle global imdb id pasting
  onPaste(event) {
    const text = event.clipboardData.getData("Text") || "";
    if (text.match(/^tt\d{6,10}$/)) {
      events.dispatch(Events.IMDB_PASTE, { imdbId: text });
    }
  }

  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <BrowserRouter history={history}>
          <div className="App">
            <Switch>
              <Route exact path="/" component={Home} />
              <Route exact path="/item/:id/:imdbId?" component={Item} />
              <Route exact path="/help" component={Help} />
            </Switch>
          </div>
        </BrowserRouter>
      </MuiThemeProvider>
    );
  }
}

export default App;
