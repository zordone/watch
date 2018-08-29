import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { IconButton } from '@material-ui/core';
import ItemTable from './ItemTable';
import Header from './Header';
import * as service from './service';
import SearchField from './SearchField';
import packageJson from '../../package.json';
import './Home.css';

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            items: [],
            filteredItems: []
        };
        this.onSearchChanged = this.onSearchChanged.bind(this);
        this.onEnterKey = this.onEnterKey.bind(this);
        this.onAddNew = this.onAddNew.bind(this);
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

    onAddNew() {
        const { items } = this.state;
        const { history } = this.props;
        const newItem = { ...service.defaultItem };
        newItem._id = 'new';
        this.setState({ items: [newItem, ...items] }, () => {
            history.push('/item/new');
        });
    }

    render() {
        const { filteredItems } = this.state;
        const searchField = (
            <SearchField
                onChange={this.onSearchChanged}
                onEnterKey={this.onEnterKey}
            />
        );
        const newButton = (
            <IconButton className="NewButton" aria-label="Add new item" onClick={this.onAddNew}>
                <i className="material-icons">add</i>
            </IconButton>
        );
        return (
            <div className="Home">
                <Header {...{ searchField, newButton }} />
                <main>
                    <ItemTable items={filteredItems} />
                    <div className="Home-footer">
                        <span>{filteredItems.length} item{filteredItems.length === 1 ? '' : 's'}</span>
                        <span>v{packageJson.version}</span>
                    </div>
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
