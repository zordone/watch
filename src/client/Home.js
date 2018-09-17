/* globals document */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import IconButton from '@material-ui/core/IconButton';
import ItemTable from './ItemTable';
import Header from './Header';
import * as actions from './redux/actions';
import * as selectors from './redux/selectors';
import SearchField from './SearchField';
import Loader from './Loader';
import { anyChanged } from './utils';
import fixedHeaderWorkaround from './fixedHeader';
import packageJson from '../../package.json';
import { SearchKeywords } from '../common/enums';
import './Home.css';

class Home extends Component {
    constructor(props) {
        super(props);
        this.onSearchChanged = this.onSearchChanged.bind(this);
        this.onShortcut = this.onShortcut.bind(this);
        this.onAddNew = this.onAddNew.bind(this);
        this.onRowClick = this.onRowClick.bind(this);
    }

    componentDidMount() {
        fixedHeaderWorkaround();
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
        this.scrollToCurrent();
        return anyChanged(['search', 'filteredItems'], this.props, nextProps);
    }

    componentWillUnmount() {
        const { setFirstLoad } = this.props;
        setFirstLoad(false);
    }

    onSearchChanged(search) {
        const { items, setSearch } = this.props;
        const searchWords = search
            .split(' ')
            .map(word => word.trim())
            .filter(word => word);
        if (!searchWords.length) {
            setSearch('', items);
            this.scrollToCurrent();
            return;
        }
        const filteredItems = items.filter(item => (
            searchWords.every(word => {
                const { text, starts, equals } = item.searchData;
                const isKeyword = Object.values(SearchKeywords).includes(word);
                return (
                    (!isKeyword && text.includes(word)) ||
                    (!isKeyword && starts.find(startItem => startItem.startsWith(word))) ||
                    (isKeyword && equals.includes(word))
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

    onRowClick(id) {
        const { history, setCurrentId } = this.props;
        setCurrentId(id);
        history.push(`/item/${id}`);
    }

    scrollToCurrent() {
        const { currentId, setCurrentId } = this.props;
        if (currentId) {
            const currentRow = document.querySelector('.ItemRow.current');
            if (currentRow) {
                currentRow.scrollIntoViewIfNeeded();
            }
        }
        setCurrentId('');
    }

    render() {
        const { filteredItems, firstLoad, search, currentId } = this.props;
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
                    <ItemTable
                        items={filteredItems}
                        currentId={currentId}
                        onRowClick={this.onRowClick}
                    />
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
    firstLoad: selectors.getFirstLoad(state),
    currentId: selectors.getCurrentId(state)
});

const mapDispatchToProps = dispatch => ({
    fetchItems: () => dispatch(actions.fetchItems()),
    setSearch: (search, filteredItems) => dispatch(actions.setSearch(search, filteredItems)),
    setFirstLoad: firstLoad => dispatch(actions.setFirstLoad(firstLoad)),
    setCurrentId: currentId => dispatch(actions.setCurrentId(currentId))
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Home);
