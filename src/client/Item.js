import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TextField, Button } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import * as service from './service';
import GenreField from './GenreField';
import './Item.css';

class Item extends Component {
    constructor(props) {
        super(props);
        this.state = {
            item: {
                title: '',
                type: '',
                genres: []
            }
        };
        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onClose = this.onClose.bind(this);
    }

    componentDidMount() {
        const { match } = this.props;
        const { id } = match.params;
        service.getItemById(id)
            .then(item => {
                this.setState({ item });
            });
    }

    onChange(event) {
        const { item } = this.state;
        const { id, value } = event.target;
        this.setState({
            item: {
                ...item,
                [id]: value
            }
        });
    }

    onSubmit() {
        const { match } = this.props;
        const { id } = match.params;
        const { item } = this.state;
        service.updateItemById(id, item)
            .then(saved => {
                this.setState({ item: saved });
                this.onClose();
            });
        // TODO: show error message
    }

    onClose() {
        const { history } = this.props;
        history.goBack();
    }

    render() {
        const { item } = this.state;
        return (
            <div className="Item">
                <Paper className="Item-paper">
                    <form noValidate autoComplete="off">
                        <TextField
                            id="title"
                            label="Title"
                            fullWidth
                            onChange={this.onChange}
                            value={item.title}
                            className="Item-row"
                            autoFocus
                        />
                        <TextField
                            id="type"
                            label="Type"
                            onChange={this.onChange}
                            value={item.type}
                            className="Item-row"
                        />
                        <GenreField
                            id="genres"
                            label="Genres"
                            onChange={this.onChange}
                            value={item.genres}
                            className="Item-row"
                        />
                        <br />
                        <div className="Item-buttons">
                            <Button variant="contained" color="primary" className="Item-button" onClick={this.onSubmit}>Submit</Button>
                            <Button variant="contained" color="default" className="Item-button" onClick={this.onClose}>Cancel</Button>
                        </div>
                    </form>
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
