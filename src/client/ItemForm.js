import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TextField } from '@material-ui/core';
import GenreField from './GenreField';
import * as service from './service';
import './ItemForm.css';

class ItemForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            item: { ...service.defaultItem }
        };
        this.onFieldChange = this.onFieldChange.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        this.state = {
            item: { ...nextProps.item }
        };
    }

    onFieldChange(event) {
        const { item } = this.state;
        const { onChange } = this.props;
        const { id, value } = event.target;
        const newItem = {
            ...item,
            [id]: value
        };
        this.setState({
            item: newItem
        });
        onChange(newItem);
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
            <form noValidate autoComplete="off" className="ItemForm">
                <div className="ItemForm-grid">
                    <TextField
                        id="title"
                        label="Title"
                        onChange={this.onFieldChange}
                        value={item.title}
                        style={this.gridPosition(1, 1, 5)}
                        autoFocus
                    />
                    <TextField
                        id="type"
                        label="Type"
                        onChange={this.onFieldChange}
                        value={item.type}
                        style={this.gridPosition(2, 1)}
                    />
                    <GenreField
                        id="genres"
                        label="Genres"
                        onChange={this.onFieldChange}
                        value={item.genres}
                        style={this.gridPosition(2, 2, 3)}
                    />
                    <TextField
                        id="withVali"
                        label="With Vali"
                        onChange={this.onFieldChange}
                        value={item.withVali}
                        style={this.gridPosition(2, 5)}
                    />
                    <TextField
                        id="lastWatched"
                        label="Last watched"
                        type="number"
                        inputProps={{ min: '1', max: '99' }}
                        onChange={this.onFieldChange}
                        value={item.lastWatched}
                        style={this.gridPosition(3, 1)}
                    />
                    <TextField
                        id="inProgress"
                        label="In progress"
                        type="number"
                        inputProps={{ min: '1', max: '99' }}
                        onChange={this.onFieldChange}
                        value={item.inProgress}
                        style={this.gridPosition(3, 2)}
                    />
                    <TextField
                        id="nextDate"
                        label="Next date"
                        type="date"
                        onChange={this.onFieldChange}
                        value={item.nextDate}
                        style={this.gridPosition(3, 3)}
                        className={item.nextDate ? '' : 'ItemForm-empty'}
                    />
                    <TextField
                        // TODO: make this a select
                        id="nextType"
                        label="Next type"
                        onChange={this.onFieldChange}
                        value={item.nextType}
                        style={this.gridPosition(3, 4)}
                    />
                    <TextField
                        id="finished"
                        label="Finished"
                        type="date"
                        onChange={this.onFieldChange}
                        value={item.finished}
                        style={this.gridPosition(3, 5)}
                        className={item.finished ? '' : 'ItemForm-empty'}
                    />
                    <TextField
                        id="notes"
                        label="Notes"
                        onChange={this.onFieldChange}
                        value={item.notes}
                        style={this.gridPosition(4, 1, 4)}
                    />
                    <TextField
                        id="imdbId"
                        label="IMDb ID"
                        onChange={this.onFieldChange}
                        value={item.imdbId}
                        style={this.gridPosition(4, 5)}
                    />
                </div>
            </form>
        );
    }
}

ItemForm.propTypes = {
    item: PropTypes.shape({}).isRequired,
    onChange: PropTypes.func.isRequired
};

export default ItemForm;
