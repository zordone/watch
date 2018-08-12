/* global fetch */

import React, { Component } from 'react';
import './App.css';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            list: []
        };
    }

    componentDidMount() {
        fetch('http://localhost:3000/items')
            .then(res => res.json())
            .then(list => list.map(item => ({
                ...item,
                id: item._id // eslint-disable-line no-underscore-dangle
            })))
            .then(list => {
                this.setState({ list });
            });
    }

    render() {
        const { list } = this.state;
        return (
            <div className="App">
                <header className="App-header">
                    <h1 className="App-title">
                        Watch
                    </h1>
                    <h2 className="App-subtitle">
                        Movies and TV Shows
                    </h2>
                </header>
                <ul>
                    {list.map(item => (
                        <li key={item.id}>
                            {item.title}
                        </li>
                    ))}
                </ul>
            </div>
        );
    }
}

export default App;
