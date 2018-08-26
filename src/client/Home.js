import React, { Component } from 'react';
import ItemTable from './ItemTable';
import Header from './Header';
import * as service from './service';
import SearchField from './SearchField';

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            items: [],
            filteredItems: []
        };
        this.onSearchChanged = this.onSearchChanged.bind(this);
    }

    componentDidMount() {
        service.listItems()
            .then(items => {
                this.setState({ items }, () => this.onSearchChanged(''));
            })
            .catch(console.error);
    }

    onSearchChanged(search) {
        const { items } = this.state;
        const searchWords = search.split(' ').map(word => word.trim()).filter(word => word);
        if (!searchWords.length) {
            this.setState({
                filteredItems: items
            });
            return;
        }
        const filteredItems = items.filter(item => (
            searchWords.every(word => item.searchText.includes(word))
        ));
        this.setState({
            filteredItems
        });
    }

    render() {
        const { filteredItems } = this.state;
        return (
            <div className="Home">
                <Header subtitle="Movies and TV Shows">
                    <SearchField onChange={this.onSearchChanged} />
                </Header>
                <main>
                    <ItemTable items={filteredItems} />
                </main>
            </div>
        );
    }
}

export default Home;
