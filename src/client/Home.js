import React, { Component } from 'react';
import PropTypes from 'prop-types';
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
        this.onEnterKey = this.onEnterKey.bind(this);
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

    onEnterKey() {
        const { filteredItems } = this.state;
        const { history } = this.props;
        const item = filteredItems[0];
        if (item) {
            history.push(`/item/${item._id}`);
        }
    }

    render() {
        const { filteredItems } = this.state;
        return (
            <div className="Home">
                <Header subtitle="Movies and TV Shows">
                    <SearchField onChange={this.onSearchChanged} onEnterKey={this.onEnterKey} />
                </Header>
                <main>
                    <ItemTable items={filteredItems} />
                </main>
            </div>
        );
    }
}

Home.propTypes = {
    history: PropTypes.shape({
        goBack: PropTypes.func.isRequired
    }).isRequired
};

export default Home;
