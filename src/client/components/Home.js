/* globals document */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import IconButton from '@material-ui/core/IconButton';
import Snackbar from '@material-ui/core/Snackbar';
import Add from '@material-ui/icons/Add';
import CheckCircle from '@material-ui/icons/CheckCircle';
import ItemTable from './ItemTable';
import Header from './Header';
import * as actions from '../redux/actions';
import * as selectors from '../redux/selectors';
import SearchField from './SearchField';
import Loader from './Loader';
import { anyChanged, noop } from '../service/utils';
import fixedHeaderWorkaround from '../service/fixedHeader';
import packageJson from '../../../package.json';
import { SearchKeywords, SortComparators } from '../../common/enums';
import { sortTitles } from '../service/sort';
import _ from '../../common/lodashReduced';
import './Home.css';

class Home extends Component {
    constructor(props) {
        super(props);
        this.currentSearch = '';
        this.onImdbPaste = this.onImdbPaste.bind(this);
        this.onSearchChanged = this.onSearchChanged.bind(this);
        this.onShortcut = this.onShortcut.bind(this);
        this.onAddNew = this.onAddNew.bind(this);
        this.onRowClick = this.onRowClick.bind(this);
        this.onSnackClose = this.onSnackClose.bind(this);
        this.updateSearch = _.throttle(this.updateSearch, 1000);
    }

    componentDidMount() {
        fixedHeaderWorkaround();
        document.addEventListener('imdbPaste', this.onImdbPaste);
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
        return anyChanged(['search', 'filteredItems', 'snackOpen'], this.props, nextProps);
    }

    componentWillUnmount() {
        const { setFirstLoad } = this.props;
        setFirstLoad(false);
        document.removeEventListener('imdbPaste', this.onImdbPaste);
    }

    onImdbPaste(event) {
        this.onAddNew(event, event.detail.imdbId);
    }

    onShortcut(code, inSearch) {
        const { filteredItems, history, items, sort, setSort, setSnack } = this.props;
        if (code === 'Enter') {
            // open first item
            const item = filteredItems[0];
            const isSortCommand = this.currentSearch.startsWith('sort:');
            if (item && !isSortCommand) {
                history.push(`/item/${item._id}`);
                return;
            }
            // set sort
            if (isSortCommand) {
                const newSort = this.currentSearch.replace('sort:', '').toLowerCase() || SortComparators.DEFAULT;
                const isValid = Object.values(SortComparators).includes(newSort);
                if (!isValid) {
                    return;
                }
                if (sort !== newSort) {
                    setSort(items, newSort);
                    setSnack(true, `Sorted by ${sortTitles[newSort]}.`);
                }
                this.updateSearch('');
            }
        } else if (code === 'KeyN' && !inSearch) {
            // add new item
            this.onAddNew();
        }
    }

    onAddNew(event, imdbId) {
        const { history } = this.props;
        const imdbParam = imdbId ? `/${imdbId}` : '';
        history.push(`/item/new${imdbParam}`);
    }

    onRowClick(id) {
        const { history, setCurrentId } = this.props;
        setCurrentId(id);
        history.push(`/item/${id}`);
    }

    onSearchChanged(search) {
        this.currentSearch = search;
        this.updateSearch(search);
    }

    onSnackClose() {
        const { setSnack } = this.props;
        setSnack(false);
    }

    updateSearch(search) {
        const { items, setSearch } = this.props;
        if (search.startsWith('sort:')) {
            this.updateSearch.cancel();
            return;
        }
        const searchWords = search
            .toLowerCase()
            .split(' ')
            .map(word => word.trim())
            .filter(Boolean);
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
                    equals.includes(word)
                );
            })
        ));
        setSearch(search, filteredItems);
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
        const { filteredItems, firstLoad, search, currentId, snackOpen, snackText } = this.props;
        // TODO: don't always rerender these buttons
        const searchField = (
            <SearchField
                onChange={this.onSearchChanged}
                onShortcut={this.onShortcut}
                value={search}
            />
        );
        const newButton = (
            <IconButton className="NewButton" aria-label="Add new item" onClick={this.onAddNew}>
                <Add />
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
                <Snackbar
                    open={snackOpen}
                    autoHideDuration={3000}
                    onClose={this.onSnackClose}
                    message={(
                        <span>
                            <CheckCircle />
                            {snackText}
                        </span>
                    )}
                    ContentProps={{
                        classes: {
                            root: 'Home-snack',
                            message: 'Home-snackMessage'
                        }
                    }}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left'
                    }}
                    transitionDuration={500}
                />
            </div>
        );
    }
}

Home.propTypes = {
    history: PropTypes.shape({
        goBack: PropTypes.func.isRequired
    }).isRequired,
    items: PropTypes.arrayOf(PropTypes.object).isRequired,
    search: PropTypes.string.isRequired,
    filteredItems: PropTypes.arrayOf(PropTypes.object).isRequired,
    firstLoad: PropTypes.bool,
    currentId: PropTypes.string,
    sort: PropTypes.oneOf(Object.values(SortComparators)),
    snackOpen: PropTypes.bool,
    snackText: PropTypes.string,
    fetchItems: PropTypes.func,
    setSearch: PropTypes.func,
    setFirstLoad: PropTypes.func,
    setCurrentId: PropTypes.func,
    setSort: PropTypes.func
};

Home.defaultProps = {
    firstLoad: false,
    currentId: '',
    sort: SortComparators.DEFAULT,
    snackOpen: false,
    snackText: '',
    fetchItems: noop,
    setSearch: noop,
    setFirstLoad: noop,
    setCurrentId: noop,
    setSort: noop
};

const mapStateToProps = state => ({
    items: selectors.getItems(state),
    search: selectors.getSearch(state),
    filteredItems: selectors.getFilteredItems(state),
    firstLoad: selectors.getFirstLoad(state),
    currentId: selectors.getCurrentId(state),
    sort: selectors.getSort(state),
    snackOpen: selectors.getSnackOpen(state),
    snackText: selectors.getSnackText(state)
});

const mapDispatchToProps = dispatch => ({
    fetchItems: () => dispatch(actions.fetchItems()),
    setSearch: (search, filteredItems) => dispatch(actions.setSearch(search, filteredItems)),
    setFirstLoad: firstLoad => dispatch(actions.setFirstLoad(firstLoad)),
    setCurrentId: currentId => dispatch(actions.setCurrentId(currentId)),
    setSort: (items, sort) => dispatch(actions.setSort(items, sort)),
    setSnack: (open, text) => dispatch(actions.setSnack(open, text))
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Home);
