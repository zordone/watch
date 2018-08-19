import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TextField, Button } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import * as service from './service';
import GenreField from './GenreField';
import { ItemType, NextType, ValiType } from '../common/enums';
import './Item.css';

class Item extends Component {
    constructor(props) {
        super(props);
        this.state = {
            item: {
                title: '',
                type: ItemType.MOVIE,
                genres: [],
                finished: '',
                lastWatched: '',
                inProgress: '',
                nextDate: '',
                nextType: NextType.END,
                withVali: ValiType.NO,
                notes: '',
                imdbId: ''
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

    gridPosition(row, col, span) {
        return {
            gridColumn: span ? `${col} / span ${span}` : col,
            gridRow: row
        };
    }

    render() {
        const { item } = this.state;
        return (
            <div className="Item">
                <Paper className="Item-paper">
                    <form noValidate autoComplete="off">
                        <div className="Item-grid">
                            <TextField
                                id="title"
                                label="Title"
                                onChange={this.onChange}
                                value={item.title}
                                style={this.gridPosition(1, 1, 5)}
                                autoFocus
                            />
                            <TextField
                                id="type"
                                label="Type"
                                onChange={this.onChange}
                                value={item.type}
                                style={this.gridPosition(2, 1)}
                            />
                            <GenreField
                                id="genres"
                                label="Genres"
                                onChange={this.onChange}
                                value={item.genres}
                                style={this.gridPosition(2, 2, 3)}
                            />
                            <TextField
                                id="withVali"
                                label="With Vali"
                                onChange={this.onChange}
                                value={item.withVali}
                                style={this.gridPosition(2, 5)}
                            />
                            <TextField
                                id="lastWatched"
                                label="Last watched"
                                type="number"
                                onChange={this.onChange}
                                value={item.lastWatched}
                                style={this.gridPosition(3, 1)}
                            />
                            <TextField
                                id="inProgress"
                                label="In progress"
                                type="number"
                                onChange={this.onChange}
                                value={item.inProgress}
                                style={this.gridPosition(3, 2)}
                            />
                            <TextField
                                id="nextDate"
                                label="Next date"
                                type="date"
                                onChange={this.onChange}
                                value={item.nextDate}
                                style={this.gridPosition(3, 3)}
                                className={item.nextDate ? '' : 'Item-empty'}
                            />
                            <TextField
                                // TODO: make this a select
                                id="nextType"
                                label="Next type"
                                onChange={this.onChange}
                                value={item.nextType}
                                style={this.gridPosition(3, 4)}
                            />
                            <TextField
                                id="finished"
                                label="Finished"
                                type="date"
                                onChange={this.onChange}
                                value={item.finished}
                                style={this.gridPosition(3, 5)}
                                className={item.finished ? '' : 'Item-empty'}
                            />
                            <TextField
                                id="notes"
                                label="Notes"
                                onChange={this.onChange}
                                value={item.notes}
                                style={this.gridPosition(4, 1, 4)}
                            />
                            <TextField
                                id="imdbId"
                                label="IMDb ID"
                                onChange={this.onChange}
                                value={item.imdbId}
                                style={this.gridPosition(4, 5)}
                            />
                        </div>
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
