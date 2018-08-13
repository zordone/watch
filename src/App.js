/* global fetch */

import React, { Component } from 'react';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import ItemTable from './ItemTable';
import './App.css';

const theme = createMuiTheme({
    palette: {
        type: 'dark'
    }
});

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            items: []
        };
    }

    componentDidMount() {
        fetch('http://localhost:3001/items')
            .then(res => res.json())
            .then(items => items.map(item => ({
                ...item,
                id: item._id // eslint-disable-line no-underscore-dangle
            })))
            .then(items => {
                this.setState({ items });
            });
    }

    render() {
        const { items } = this.state;
        return (
            <MuiThemeProvider theme={theme}>
                <div className="App">

                    <header className="App-header">
                        <h1 className="App-title">
                            Watch
                        </h1>
                        <h2 className="App-subtitle">
                            Movies and TV Shows
                        </h2>
                    </header>

                    <main>
                        <ItemTable items={items} />
                    </main>

                </div>
            </MuiThemeProvider>
        );
    }
}

export default App;
