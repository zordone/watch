import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { IconButton } from '@material-ui/core';
import ItemTable from './ItemTable';
import Header from './Header';
import * as actions from './redux/actions';
import * as selectors from './redux/selectors';
import SearchField from './SearchField';
import Loader from './Loader';
import { anyChanged } from './utils';
import packageJson from '../../package.json';
import './Home.css';

class Home extends Component {
    constructor(props) {
        super(props);
        this.onSearchChanged = this.onSearchChanged.bind(this);
        this.onShortcut = this.onShortcut.bind(this);
        this.onAddNew = this.onAddNew.bind(this);
    }

    componentDidMount() {
        const { fetchItems, items, search } = this.props;
        const isFetched = Boolean(items.length);
        const itemsPromise = isFetched
            ? Promise.resolve()
            : fetchItems();
        itemsPromise
            .then(() => {
                this.onSearchChanged(search);
            })
            .catch(console.error);
    }

    shouldComponentUpdate(nextProps) {
        return anyChanged(['search', 'filteredItems'], this.props, nextProps);
    }

    componentWillUnmount() {
        const { setFirstLoad } = this.props;
        setFirstLoad(false);
    }

    onSearchChanged(search) {
        const { items, setSearch } = this.props;
        const searchWords = search.split(' ').map(word => word.trim()).filter(word => word);
        if (!searchWords.length) {
            setSearch('', items);
            return;
        }
        const filteredItems = items.filter(item => (
            searchWords.every(word => {
                const { text, starts, equals } = item.searchData;
                return (
                    text.includes(word) ||
                    starts.find(keyword => keyword.startsWith(word)) ||
                    equals.includes(word)
                );
            })
        ));
        setSearch(search, filteredItems);
    }

    onShortcut(code, inSearch) {
        if (code === 'Enter') {
            // open first item
            const { filteredItems, history } = this.props;
            const item = filteredItems[0];
            if (item) {
                history.push(`/item/${item._id}`);
            }
        } else if (code === 'KeyN' && !inSearch) {
            // add new item
            this.onAddNew();
        }
    }

    onAddNew() {
        const { history } = this.props;
        history.push('/item/new');
    }

    render() {
        const { filteredItems, firstLoad, search } = this.props;
        const searchField = (
            <SearchField
                onChange={this.onSearchChanged}
                onShortcut={this.onShortcut}
                value={search}
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
                {firstLoad && <Loader progress={0} />}
            </div>
        );
    }
}

Home.propTypes = {
    history: PropTypes.shape({
        goBack: PropTypes.func.isRequired
    }).isRequired,
    items: PropTypes.arrayOf(PropTypes.object).isRequired,
    fetchItems: PropTypes.func.isRequired,
    search: PropTypes.string.isRequired,
    filteredItems: PropTypes.arrayOf(PropTypes.object).isRequired
};

const mapStateToProps = state => ({
    items: selectors.getItems(state),
    search: selectors.getSearch(state),
    filteredItems: selectors.getFilteredItems(state),
    firstLoad: selectors.getFirstLoad(state)
});

const mapDispatchToProps = dispatch => ({
    fetchItems: () => dispatch(actions.fetchItems()),
    setSearch: (search, filteredItems) => dispatch(actions.setSearch(search, filteredItems)),
    setFirstLoad: firstLoad => dispatch(actions.setFirstLoad(firstLoad))
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Home);
