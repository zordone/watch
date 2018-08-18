import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Home from './Home';
import Item from './Item';
import './App.css';

const theme = createMuiTheme({
    palette: {
        type: 'dark'
    }
});

const App = () => (
    <MuiThemeProvider theme={theme}>
        <BrowserRouter>
            <div className="App">
                <Route exact path="/" component={Home} />
                <Route exact path="/item/:id" component={Item} />
            </div>
        </BrowserRouter>
    </MuiThemeProvider>
);

export default App;
