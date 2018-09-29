/* globals document */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import Create from '@material-ui/icons/Create';
import Check from '@material-ui/icons/Check';
import DeleteForever from '@material-ui/icons/DeleteForever';
import * as service from '../service/service';
import * as actions from '../redux/actions';
import * as selectors from '../redux/selectors';
import ItemForm from './ItemForm';
import ItemDetails from './ItemDetails';
import itemState from '../service/itemState';
import { anyChanged, slugify, noop } from '../service/utils';
import { defaultItem } from '../service/serviceUtils';
import PosterSearch from './PosterSearch';
import { Const, SortComparators } from '../../common/enums';
import './Item.css';

const FORM = 'form';
const DETAILS = 'details';

class Item extends Component {
    constructor(props) {
        super(props);
        this.state = {
            item: { ...defaultItem },
            page: DETAILS,
            posters: {
                visible: false,
                searching: false,
                images: []
            },
            posterScraping: false,
            error: '',
            deleteSure: false
        };
        this.findByTitle = this.findByTitle.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onSave = this.onSave.bind(this);
        this.onClose = this.onClose.bind(this);
        this.onKeyUp = this.onKeyUp.bind(this);
        this.onShowForm = this.onShowForm.bind(this);
        this.onShowDetails = this.onShowDetails.bind(this);
        this.onPosterSearch = this.onPosterSearch.bind(this);
        this.onPosterSelect = this.onPosterSelect.bind(this);
        this.onDelete = this.onDelete.bind(this);
        this.updateItemState = this.updateItemState;
    }

    componentDidMount() {
        const { match, items, fetchItems, setFirstLoad, setCurrentId } = this.props;
        const { id, imdbId } = match.params;
        if (id === Const.NEW) {
            const item = service.createNewItem();
            if (id === Const.NEW && imdbId) {
                item.imdbId = imdbId;
            }
            this.setState({
                item,
                page: FORM
            });
        } else {
            service.getItemById(id)
                .then(item => {
                    this.setState({ item });
                });
        }
        document.addEventListener('keyup', this.onKeyUp);
        // pre-fetch items in case we reloaded the app on this page
        const isFetched = Boolean(items.length);
        if (!isFetched) {
            fetchItems()
                .then(() => {
                    setFirstLoad(false);
                    setCurrentId(id);
                });
        }
    }

    componentWillReceiveProps(nextProps) {
        const { items, setSort, sort, resort } = nextProps;
        if (resort) {
            setSort(items, sort);
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return anyChanged(['page', 'item', 'posters', 'error', 'deleteSure'], this.state, nextState);
    }

    componentWillUnmount() {
        document.removeEventListener('keyup', this.onKeyUp);
    }

    onKeyUp(event) {
        if (event.code === 'Escape') {
            this.onClose();
        }
    }

    onChange(changedItem) {
        const { page } = this.state;
        const updateState = page === DETAILS;
        this.updateItemState(changedItem, updateState);
    }

    onSave() {
        const { updateItem, addNewItem, items, setSnack } = this.props;
        const { item } = this.state;
        const isNew = item._id === Const.NEW;
        if (isNew) {
            addNewItem(item);
        }
        const promise = isNew
            ? service.saveNewItem(item)
            : service.updateItemById(item._id, item);
        promise
            .then(saved => {
                this.setState({ item: saved });
                updateItem(items, saved);
                this.onClose();
                setSnack(true, 'Item updated.');
            })
            .catch(err => {
                console.error('Updating item failed.', err);
                this.setState({ error: err.message });
            });
    }

    onClose() {
        const { history } = this.props;
        history.goBack();
    }

    onShowForm() {
        this.setState({ page: FORM });
    }

    onShowDetails() {
        const { item } = this.state;
        this.setState({ page: DETAILS });
        this.updateItemState(item, true);
    }

    onPosterSearch() {
        const { item } = this.state;
        this.setState({
            posters: { visible: true, searching: true, images: [] },
            posterScraping: true
        });
        const query = `${item.title} ${item.type} poster portrait official`;
        service.searchImages(query)
        // service.mockSearchImages(3000)
            .then(images => {
                this.setState({
                    posters: { visible: true, searching: false, images },
                    posterScraping: false
                });
            })
            .catch(err => {
                this.setState({
                    posterScraping: false
                });
                throw err;
            });
    }

    onPosterSelect(url) {
        const { item } = this.state;
        if (url) {
            this.onChange({ ...item, posterUrl: url });
        }
        this.setState({
            posters: { visible: false, searching: false, images: [] }
        });
    }

    onDelete() {
        const { items, deleteItem, setSnack } = this.props;
        const { deleteSure, item } = this.state;
        if (deleteSure) {
            clearTimeout(this.deleteTimer);
            service.deleteItemById(item._id)
                .then(() => {
                    deleteItem(items, item._id);
                    this.setState({
                        error: '',
                        deleteSure: false
                    });
                    this.onClose();
                    setSnack(true, 'Item deleted.');
                })
                .catch(err => {
                    console.error('Updating item failed.', err);
                    this.setState({
                        error: err.message,
                        deleteSure: false
                    });
                });
        } else {
            this.setState({ deleteSure: true });
            this.deleteTimer = setTimeout(() => {
                this.setState({ deleteSure: false });
            }, 3000);
        }
    }

    updateItemState(changedItem, updateState = false) {
        this.setState({
            item: {
                ...changedItem,
                state: updateState
                    ? itemState(changedItem)
                    : changedItem.state
            }
        });
    }

    findByTitle(id, title) {
        const { items } = this.props;
        const titleSlug = slugify(title);
        return items.find(item => item._id !== id && slugify(item.title) === titleSlug);
    }

    render() {
        const { item, page, posters, error, deleteSure, posterScraping } = this.state;
        const isNew = item._id === Const.NEW;
        const deleteClassName = `Item-button delete${deleteSure ? ' sure' : ''}`;
        return (
            <div className="Item">
                <Paper className="Item-paper">
                    <ItemDetails
                        item={item}
                        onChange={this.onChange}
                        visible={page === DETAILS}
                        onPosterSearch={this.onPosterSearch}
                        posterScraping={posterScraping}
                    />
                    <ItemForm
                        item={item}
                        onChange={this.onChange}
                        visible={page === FORM}
                        findByTitle={this.findByTitle}
                    />
                    {error && (
                        <p className="Item-error">{error}</p>
                    )}
                    <div className="Item-buttons">
                        <Button variant="contained" color="primary" className="Item-button" onClick={this.onSave}>Save</Button>
                        <Button variant="contained" color="default" className="Item-button" onClick={this.onClose}>Cancel</Button>
                        {!isNew && (
                            <Button variant="contained" color="default" className={deleteClassName} onClick={this.onDelete}>
                                <DeleteForever />
                                <span className="title">&nbsp;Sure to delete?</span>
                                <div className="timeout" />
                            </Button>
                        )}
                    </div>
                    {page === DETAILS && (
                        <IconButton className="Item-pageButton" aria-label="Show form" onClick={this.onShowForm}>
                            <Create />
                        </IconButton>
                    )}
                    {page === FORM && (
                        <IconButton className="Item-pageButton" aria-label="Show details" onClick={this.onShowDetails}>
                            <Check />
                        </IconButton>
                    )}
                </Paper>
                <PosterSearch {...posters} onSelect={this.onPosterSelect} />
            </div>
        );
    }
}

Item.propTypes = {
    match: PropTypes.shape({
        params: PropTypes.shape({
            id: PropTypes.string.isRequired
        }).isRequired
    }).isRequired,
    history: PropTypes.shape({
        goBack: PropTypes.func.isRequired
    }).isRequired,
    items: PropTypes.arrayOf(PropTypes.object).isRequired,
    sort: PropTypes.oneOf(Object.values(SortComparators)),
    resort: PropTypes.bool,
    addNewItem: PropTypes.func,
    updateItem: PropTypes.func,
    deleteItem: PropTypes.func,
    setFirstLoad: PropTypes.func,
    setCurrentId: PropTypes.func,
    setSort: PropTypes.func
};

Item.defaultProps = {
    sort: PropTypes.oneOf(Object.values(SortComparators)),
    resort: false,
    addNewItem: noop,
    updateItem: noop,
    deleteItem: noop,
    setFirstLoad: noop,
    setCurrentId: noop,
    setSort: noop
};

const mapStateToProps = state => ({
    items: selectors.getItems(state),
    sort: selectors.getSort(state),
    resort: selectors.getResort(state)
});

const mapDispatchToProps = dispatch => ({
    fetchItems: () => dispatch(actions.fetchItems()),
    addNewItem: item => dispatch(actions.addNewItem(item)),
    updateItem: (items, item) => dispatch(actions.updateItem(items, item)),
    deleteItem: (items, id) => dispatch(actions.deleteItem(items, id)),
    setFirstLoad: firstLoad => dispatch(actions.setFirstLoad(firstLoad)),
    setCurrentId: currentId => dispatch(actions.setCurrentId(currentId)),
    setSort: (items, sort) => dispatch(actions.setSort(items, sort)),
    setSnack: (open, text) => dispatch(actions.setSnack(open, text))
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Item);
