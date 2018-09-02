/* globals document */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import { Button, IconButton } from '@material-ui/core';
import * as service from './service';
import * as actions from './redux/actions';
import * as selectors from './redux/selectors';
import ItemForm from './ItemForm';
import ItemDetails from './ItemDetails';
import itemState from './itemState';
import { anyChanged } from './utils';
import PosterSearch from './PosterSearch';
import './Item.css';

const FORM = 'form';
const DETAILS = 'details';

class Item extends Component {
    constructor(props) {
        super(props);
        this.state = {
            item: { ...service.defaultItem },
            page: DETAILS,
            posters: {
                visible: false,
                searching: false,
                images: []
            }
        };
        this.onChange = this.onChange.bind(this);
        this.onSave = this.onSave.bind(this);
        this.onClose = this.onClose.bind(this);
        this.onKeyUp = this.onKeyUp.bind(this);
        this.onShowForm = this.onShowForm.bind(this);
        this.onShowDetails = this.onShowDetails.bind(this);
        this.onPosterSearch = this.onPosterSearch.bind(this);
        this.onPosterSelect = this.onPosterSelect.bind(this);
    }

    componentDidMount() {
        const { match } = this.props;
        const { id } = match.params;
        if (id === 'new') {
            this.setState({
                item: service.createNewItem(),
                page: FORM
            });
        } else {
            service.getItemById(id)
                .then(item => {
                    this.setState({ item });
                });
        }
        document.addEventListener('keyup', this.onKeyUp);
    }

    shouldComponentUpdate(nextProps, nextState) {
        return anyChanged(['page', 'item', 'posters'], this.state, nextState);
    }

    componentWillUnmount() {
        document.removeEventListener('keyup', this.onKeyUp);
    }

    onKeyUp(event) {
        if (event.code === 'Escape') {
            this.onClose();
        }
    }

    onChange(item) {
        this.setState({
            item: {
                ...item,
                state: itemState(item)
            }
        });
    }

    onSave() {
        const { updateItem, addNewItem, items } = this.props;
        const { item } = this.state;
        const isNew = item._id === 'new';
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
            })
            .catch(err => {
                console.error('Updating item failed.', err);
                // TODO: show error message
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
        this.setState({ page: DETAILS });
    }

    onPosterSearch() {
        const { item } = this.state;
        this.setState({
            posters: { visible: true, searching: true, images: [] }
        });
        const query = `${item.title} ${item.type} poster portrait official`;
        service.searchImages(query)
        // service.mockSearchImages(3000)
            .then(images => {
                this.setState({
                    posters: { visible: true, searching: false, images }
                });
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

    render() {
        const { item, page, posters } = this.state;
        return (
            <div className="Item">
                <Paper className="Item-paper">
                    <ItemDetails
                        item={item}
                        onChange={this.onChange}
                        visible={page === DETAILS}
                        onPosterSearch={this.onPosterSearch}
                    />
                    <ItemForm item={item} onChange={this.onChange} visible={page === FORM} />
                    <div className="Item-buttons">
                        <Button variant="contained" color="primary" className="Item-button" onClick={this.onSave}>Save</Button>
                        <Button variant="contained" color="default" className="Item-button" onClick={this.onClose}>Cancel</Button>
                    </div>
                    {page === DETAILS && (
                        <IconButton className="Item-pageButton" aria-label="Show form" onClick={this.onShowForm}>
                            <i className="material-icons">create</i>
                        </IconButton>
                    )}
                    {page === FORM && (
                        <IconButton className="Item-pageButton" aria-label="Show details" onClick={this.onShowDetails}>
                            <i className="material-icons">check</i>
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
    addNewItem: PropTypes.func.isRequired,
    updateItem: PropTypes.func.isRequired,
    items: PropTypes.arrayOf(PropTypes.object).isRequired
};

const mapStateToProps = state => ({
    items: selectors.getItems(state)
});

const mapDispatchToProps = dispatch => ({
    addNewItem: item => dispatch(actions.addNewItem(item)),
    updateItem: (items, item) => dispatch(actions.updateItem(items, item))
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Item);
