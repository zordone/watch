import React, { Component } from 'react';
import './App.css';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // list: []
        };
    }

    componentDidMount() {
    }

    render() {
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
                <p className="App-intro">
                    Hello World!
                </p>
            </div>
        );
    }
}

export default App;
