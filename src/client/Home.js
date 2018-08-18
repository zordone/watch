import React, { Component } from 'react';
import ItemTable from './ItemTable';
import Header from './Header';
import * as service from './service';

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            items: []
        };
    }

    componentDidMount() {
        service.listItems()
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
