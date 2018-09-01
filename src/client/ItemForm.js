import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TextField } from '@material-ui/core';
import GenreField from './GenreField';
import * as service from './service';
import { ItemType, ValiType, NextType, FinishedType } from '../common/enums';
import SelectField from './SelectField';
import { parseDate, cachePureFunction } from './utils';
import './ItemForm.css';

class ItemForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            item: { ...service.defaultItem }
        };
        this.onFieldChange = this.onFieldChange.bind(this);
        this.onDateKeyDown = this.onDateKeyDown.bind(this);
        // cache pure stuff
        this.gridPosition = cachePureFunction(this.gridPosition);
        this.formStyle = cachePureFunction(this.formStyle);
        this.seasonInputProps = { min: '1', max: '99' };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            item: { ...nextProps.item }
        });
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

    onDateKeyDown(event) {
        if (event.key.toLowerCase() === 't') {
            const { id } = event.target;
            const value = parseDate(new Date()).input;
            this.onFieldChange({ target: { id, value } });
        }
    }

    gridPosition(row, col, span) {
        return {
            gridColumn: span ? `${col} / span ${span}` : col,
            gridRow: row
        };
    }

    formStyle(visible) {
        return {
            display: visible ? 'block' : 'none'
        };
    }

    render() {
        const { item } = this.state;
        const { visible } = this.props;
        return (
            <form noValidate autoComplete="off" className="ItemForm" style={this.formStyle(visible)}>
                <div className="ItemForm-grid">
                    <TextField
                        id="title"
                        label="Title"
                        onChange={this.onFieldChange}
                        value={item.title}
                        style={this.gridPosition(1, 1, 4)}
                        autoFocus
                    />
                    <SelectField
                        id="type"
                        label="Type"
                        onChange={this.onFieldChange}
                        value={item.type}
                        style={this.gridPosition(2, 1)}
                        options={Object.values(ItemType)}
                    />
                    <GenreField
                        id="genres"
                        label="Genres"
                        onChange={this.onFieldChange}
                        value={item.genres}
                        style={this.gridPosition(2, 2, 3)}
                    />
                    <SelectField
                        id="withVali"
                        label="With Vali"
                        onChange={this.onFieldChange}
                        value={item.withVali}
                        style={this.gridPosition(2, 5)}
                        options={Object.values(ValiType)}
                    />
                    <TextField
                        id="lastWatched"
                        label="Last watched"
                        type="number"
                        inputProps={this.seasonInputProps}
                        onChange={this.onFieldChange}
                        value={item.lastWatched}
                        style={this.gridPosition(3, 1)}
                    />
                    <TextField
                        id="inProgress"
                        label="In progress"
                        type="number"
                        inputProps={this.seasonInputProps}
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
                        onKeyDown={this.onDateKeyDown}
                    />
                    <SelectField
                        id="nextType"
                        label="Next type"
                        onChange={this.onFieldChange}
                        value={item.nextType}
                        style={this.gridPosition(3, 4)}
                        options={Object.values(NextType)}
                    />
                    <SelectField
                        id="finished"
                        label="Finished"
                        onChange={this.onFieldChange}
                        value={item.finished}
                        style={this.gridPosition(3, 5)}
                        options={Object.values(FinishedType)}
                    />
                    <TextField
                        id="notes"
                        label="Notes"
                        onChange={this.onFieldChange}
                        value={item.notes}
                        style={this.gridPosition(4, 1, 5)}
                    />
                    <TextField
                        id="imdbId"
                        label="IMDb ID"
                        onChange={this.onFieldChange}
                        value={item.imdbId}
                        style={this.gridPosition(5, 1)}
                    />
                    <TextField
                        id="posterUrl"
                        label="Poster URL"
                        onChange={this.onFieldChange}
                        value={item.posterUrl}
                        style={this.gridPosition(5, 2)}
                    />
                </div>
            </form>
        );
    }
}

ItemForm.propTypes = {
    item: PropTypes.shape({}).isRequired,
    onChange: PropTypes.func.isRequired,
    visible: PropTypes.bool
};

ItemForm.defaultProps = {
    visible: true
};

export default ItemForm;
