/* globals document */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import { Button, IconButton } from '@material-ui/core';
import * as service from './service';
import ItemForm from './ItemForm';
import ItemDetails from './ItemDetails';
import './Item.css';
import itemState from './itemState';

const FORM = 'form';
const DETAILS = 'details';

class Item extends Component {
    constructor(props) {
        super(props);
        this.state = {
            item: { ...service.defaultItem },
            page: DETAILS
        };
        this.onChange = this.onChange.bind(this);
        this.onSave = this.onSave.bind(this);
        this.onClose = this.onClose.bind(this);
        this.onKeyUp = this.onKeyUp.bind(this);
        this.onShowForm = this.onShowForm.bind(this);
        this.onShowDetails = this.onShowDetails.bind(this);
    }

    componentDidMount() {
        const { match } = this.props;
        const { id } = match.params;
        service.getItemById(id)
            .then(item => {
                this.setState({ item });
            });
        document.addEventListener('keyup', this.onKeyUp);
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
        const { item } = this.state;
        service.updateItemById(item._id, item)
            .then(saved => {
                this.setState({ item: saved });
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

    render() {
        const { item, page } = this.state;
        return (
            <div className="Item">
                <Paper className="Item-paper">
                    <ItemDetails item={item} onChange={this.onChange} visible={page === DETAILS} />
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
    }).isRequired
};

export default Item;
