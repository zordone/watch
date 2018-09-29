import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import Home from './Home';
import Item from './Item';
import './App.css';

const theme = createMuiTheme({
    palette: {
        type: 'dark',
        primary: {
            main: '#00a9ff'
        },
        secondary: {
            main: '#ff9500'
        }
    },
    typography: {
        fontFamily: 'Roboto,Arial,sans-serif'
    }
});

const App = () => (
    <MuiThemeProvider theme={theme}>
        <BrowserRouter>
            <div className="App">
                <Switch>
                    <Route exact path="/" component={Home} />
                    <Route exact path="/item/:id/:imdbId?" component={Item} />
                </Switch>
            </div>
        </BrowserRouter>
    </MuiThemeProvider>
);

export default App;