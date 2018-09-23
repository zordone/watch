import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import GenreField from './GenreField';
import ChipArrayInput from './ChipArrayInput';
import * as service from './service/service';
import { ItemType, ValiType, NextType, FinishedType, Const } from '../common/enums';
import SelectField from './SelectField';
import { parseDate, cachePureFunction } from './service/utils';
import ScrapeButton from './ScrapeButton';
import _ from '../common/lodashReduced';
import './ItemForm.css';

const MAX_GENRES = 4;

class ItemForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            item: { ...service.defaultItem },
            sameTitle: undefined,
            imdbScraping: false
        };
        this.onTitleChange = this.onTitleChange.bind(this);
        this.onTitleChange = _.debounce(this.onTitleChange, 1000);
        this.onFieldChange = this.onFieldChange.bind(this);
        this.onDateKeyDown = this.onDateKeyDown.bind(this);
        this.onImdbScrape = this.onImdbScrape.bind(this);
        // cache pure stuff
        this.formStyle = cachePureFunction(this.formStyle);
        this.seasonInputProps = { min: '1', max: '99' };
        this.releaseYearInputProps = { min: '1900', max: '2100' };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            item: { ...nextProps.item }
        });
    }

    componentDidUpdate() {
        const { item, imdbScraping } = this.state;
        const isNew = item._id === Const.NEW;
        const hasTitle = Boolean(item.title);
        const hasImdb = Boolean(item.imdbId);
        if (isNew && !hasTitle && hasImdb && !imdbScraping) {
            this.onImdbScrape();
        }
    }

    onTitleChange() {
        const { findByTitle } = this.props;
        const { item, sameTitle } = this.state;
        const other = findByTitle(item._id, item.title);
        if (other !== sameTitle) {
            const { _id: id, title } = other || {};
            if (id) {
                this.sameTitleLink = <a href={`/item/${id}`} target="_blank" rel="noopener noreferrer">{title}</a>;
            }
            this.setState({ sameTitle: other });
        }
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
        if (item.title !== newItem.title) {
            this.onTitleChange();
        }
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
        this.setState({ imdbScraping: true });
        service
            .imdbData(item.imdbId)
            .then(data => {
                console.log('imdb data', data);
                const parsed = data.parsed || {};
                const newItem = {
                    ...item,
                    ...parsed
                };
                if (newItem.genres.length > MAX_GENRES) {
                    newItem.genres = newItem.genres.slice(0, MAX_GENRES);
                }
                const fillNextDate = (
                    !newItem.nextDate &&
                    !newItem.lastWatched &&
                    !newItem.input
                );
                if (fillNextDate) {
                    newItem.nextDate = parsed.released;
                    newItem.nextType = NextType.RELEASE;
                }
                this.setState({
                    item: newItem,
                    imdbScraping: false
                });
                onChange(newItem);
                this.onTitleChange();
            })
            .catch(err => {
                this.setState({ imdbScraping: false });
                throw err;
            });
    }

    formStyle(visible) {
        return {
            display: visible ? 'block' : 'none'
        };
    }

    render() {
        const { item, imdbScraping, sameTitle } = this.state;
        const { visible } = this.props;
        return (
            <form noValidate autoComplete="off" className="ItemForm" style={this.formStyle(visible)}>
                <div className="ItemForm-grid">
                    <div className="title">
                        <TextField
                            id="title"
                            label="Title"
                            className="title-field"
                            onChange={this.onFieldChange}
                            value={item.title}
                            fullWidth
                            autoFocus
                        />
                        <div className={`same-title ${sameTitle ? 'show' : ''}`}>
                            This title is already taken by: {this.sameTitleLink}
                        </div>
                    </div>
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
                        maxGenres={MAX_GENRES}
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
                        multiline
                    />
                    <ChipArrayInput
                        id="keywords"
                        className="keyw"
                        label="Keywords"
                        onChange={this.onFieldChange}
                        value={item.keywords}
                    />
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
                        <ScrapeButton
                            className="imdb-scrape"
                            ariaLabel="Fill from IMDb"
                            visible={Boolean(item.imdbId)}
                            inProgress={imdbScraping}
                            onClick={this.onImdbScrape}
                        />
                    </div>
                    <TextField
                        id="posterUrl"
                        className="poster"
                        label="Poster URL"
                        onChange={this.onFieldChange}
                        value={item.posterUrl}
                    />
                    <TextField
                        id="releaseYear"
                        className="relyr"
                        label="Release year"
                        type="number"
                        inputProps={this.releaseYearInputProps}
                        onChange={this.onFieldChange}
                        value={item.releaseYear}
                    />
                </div>
            </form>
        );
    }
}

ItemForm.propTypes = {
    item: PropTypes.shape({}).isRequired,
    onChange: PropTypes.func.isRequired,
    findByTitle: PropTypes.func,
    visible: PropTypes.bool
};

ItemForm.defaultProps = {
    findByTitle: () => undefined,
    visible: true
};

export default ItemForm;
