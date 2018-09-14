import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TextField, IconButton } from '@material-ui/core';
import { CloudDownload } from '@material-ui/icons';
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
        this.onImdbScrape = this.onImdbScrape.bind(this);
        // cache pure stuff
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

    onImdbScrape() {
        const { item } = this.state;
        const { onChange } = this.props;
        service
            .imdbData(item.imdbId)
            .then(data => {
                console.log('imdb data', data);
                const parsed = data.parsed || {};
                const newItem = {
                    ...item,
                    ...parsed
                };
                this.setState({ item: newItem });
                onChange(newItem);
            });
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
                        className="title"
                        label="Title"
                        onChange={this.onFieldChange}
                        value={item.title}
                        autoFocus
                    />
                    <SelectField
                        id="type"
                        className="type"
                        label="Type"
                        onChange={this.onFieldChange}
                        value={item.type}
                        options={Object.values(ItemType)}
                    />
                    <GenreField
                        id="genres"
                        className="genres"
                        label="Genres"
                        onChange={this.onFieldChange}
                        value={item.genres}
                        maxGenres={4}
                    />
                    <SelectField
                        id="withVali"
                        className="vali"
                        label="With Vali"
                        onChange={this.onFieldChange}
                        value={item.withVali}
                        options={Object.values(ValiType)}
                    />
                    <TextField
                        id="lastWatched"
                        className="last"
                        label="Last watched"
                        type="number"
                        inputProps={this.seasonInputProps}
                        onChange={this.onFieldChange}
                        value={item.lastWatched}
                    />
                    <TextField
                        id="inProgress"
                        className="progress"
                        label="In progress"
                        type="number"
                        inputProps={this.seasonInputProps}
                        onChange={this.onFieldChange}
                        value={item.inProgress}
                    />
                    <TextField
                        id="nextDate"
                        className={`ndate ${item.nextDate ? '' : 'ItemForm-empty'}`}
                        label="Next date"
                        type="date"
                        onChange={this.onFieldChange}
                        value={item.nextDate}
                        onKeyDown={this.onDateKeyDown}
                    />
                    <SelectField
                        id="nextType"
                        className="ntype"
                        label="Next type"
                        onChange={this.onFieldChange}
                        value={item.nextType}
                        options={Object.values(NextType)}
                    />
                    <SelectField
                        id="finished"
                        className="finished"
                        label="Finished"
                        onChange={this.onFieldChange}
                        value={item.finished}
                        options={Object.values(FinishedType)}
                    />
                    <TextField
                        id="description"
                        className="descr"
                        label="Description"
                        onChange={this.onFieldChange}
                        value={item.description}
                    />
                    <TextField
                        id="keywords"
                        className="keyw"
                        label="Keywords"
                        onChange={this.onFieldChange}
                        value={item.keywords.join(', ')}
                    />
                    {/* <ChipInput
                        id="keywords"
                        className="keyw"
                        label="Keywords"
                        onChange={this.onFieldChange}
                        value={item.keywords}
                    /> */}
                    <TextField
                        id="notes"
                        className="notes"
                        label="Notes"
                        onChange={this.onFieldChange}
                        value={item.notes}
                    />
                    <div className="imdb">
                        <TextField
                            id="imdbId"
                            label="IMDb ID"
                            onChange={this.onFieldChange}
                            value={item.imdbId}
                        />
                        <IconButton
                            className="imdb-scrape"
                            aria-label="Fill from IMDb"
                            onClick={this.onImdbScrape}
                            style={{ display: item.imdbId ? 'block' : 'none' }}
                        >
                            <CloudDownload />
                        </IconButton>
                    </div>
                    <TextField
                        id="posterUrl"
                        className="poster"
                        label="Poster URL"
                        onChange={this.onFieldChange}
                        value={item.posterUrl}
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
