/* global fetch */

import React, { Component } from 'react';
import ItemTable from './ItemTable';
import Header from './Header';

class Home extends Component {
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
            })
            .catch(console.error);
    }

    render() {
        const { items } = this.state;
        return (
            <div className="Home">
                <Header subtitle="Movies and TV Shows" />
                <main>
                    <ItemTable items={items} />
                </main>
            </div>
        );
    }
}

export default Home;
