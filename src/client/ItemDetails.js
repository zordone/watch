import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from '@material-ui/core';
import * as service from './service';
import Poster from './Poster';
import './ItemDetails.css';
import StateLabel from './StateLabel';
import { ItemType, FinishedType, StateType, NextType, ValiType } from '../common/enums';
import { inputDateAddMonth, parseDate, seasonCode, getNextSeasonNum } from './utils';

const DetailsRow = ({ label, value, className = '', optional = false }) => {
    if (optional && !value) {
        return null;
    }
    return [
        <div key="label" className={`ItemDetails-label ${className}`}>{label}</div>,
        <div key="value" className={`ItemDetails-value ${className}`}>{value}</div>
    ];
};

class ItemDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            item: { ...service.defaultItem }
        };
    }

    componentWillReceiveProps(nextProps) {
        const { item } = nextProps;
        const buttons = this.getButtons(item);
        const links = this.getLinks(item);
        this.setState({
            item: { ...item },
            buttons,
            links
        });
    }

    getButtons(item) {
        const buttons = [];
        const addButton = (label, onClick) => {
            buttons.push(
                <Button key={label} variant="contained" color="secondary" className="ItemDetails-button" onClick={onClick}>{label}</Button>
            );
        };
        const isMovie = item.type === ItemType.MOVIE;
        const isWaitingOrRecheck = [StateType.WAITING, StateType.RECHECK].includes(item.state.type);
        const nextSeasonNum = getNextSeasonNum(item);
        // TODO: no buttons for new item
        if (item.state.type === StateType.FINISHED) {
            return buttons;
        }
        if (isWaitingOrRecheck) {
            const name = isMovie ? 'Movie' : seasonCode(nextSeasonNum);
            addButton(`${name} is available now`, () => {
                this.updateItem({
                    nextDate: parseDate(new Date()).input,
                    nextType: NextType.AVAILABLE
                });
            });
            addButton('Check a month later', () => {
                this.updateItem({ nextDate: inputDateAddMonth(item.nextDate, 1) });
            });
            if (!isMovie) {
                addButton('Finished the show', () => {
                    this.updateItem({
                        finished: FinishedType.YES,
                        nextDate: '',
                        nextType: ''
                    });
                });
            }
        }
        if (item.state.type === StateType.READY) {
            if (isMovie) {
                addButton('Watched the movie', () => {
                    this.updateItem({
                        finished: FinishedType.YES,
                        nextDate: '',
                        nextType: ''
                    });
                });
            } else {
                addButton(`Start watching ${seasonCode(nextSeasonNum)}`, () => {
                    this.updateItem({
                        inProgress: nextSeasonNum,
                        nextDate: '',
                        nextType: ''
                    });
                });
            }
        }
        if (item.state.type === StateType.PROGRESS && !isMovie) {
            addButton(`Finished ${seasonCode(item.inProgress)}`, () => {
                this.updateItem({
                    lastWatched: item.inProgress,
                    inProgress: '',
                    nextDate: parseDate(new Date()).input,
                    nextType: NextType.RECHECK
                });
            });
        }
        return buttons;
    }

    getLinks(item) {
        const links = [];
        const addLink = (label, url) => links.push(
            <a key={label} href={url} target="_blank" rel="noopener noreferrer">{label}</a>
        );
        const isMovie = item.type === ItemType.MOVIE;
        const isFinished = item.finished === FinishedType.YES;
        const inProgress = Boolean(item.inProgress);
        const title = encodeURIComponent(item.title);
        // IMDb
        if (item.imdbId) {
            addLink('IMDb page', `http://www.imdb.com/title/${item.imdbId}/?ref_=fn_tv_tt_1`);
        } else {
            const params = isMovie ? '&s=tt&ttype=ft' : '&s=tt&ttype=tv&ref_=fn_tv';
            addLink('IMDb search', `http://www.imdb.com/find?q=${title}${params}`);
        }
        // Subtitles
        if (!isFinished && item.withVali !== ValiType.NO) {
            addLink('Subtitle search', `https://www.feliratok.info/?search=${title}&nyelv=Magyar`);
        }
        // Youtube recap
        if (!isFinished && !inProgress && !isMovie && item.lastWatched) {
            const query = encodeURIComponent(`${item.title} season ${item.lastWatched} recap`);
            addLink(`${seasonCode(item.lastWatched)} recap`, `https://www.youtube.com/results?search_query=${query}`);
        }
        // Youtube trailer
        if (!isFinished && !inProgress) {
            const nextSeasonNum = getNextSeasonNum(item);
            const name = isMovie ? 'Movie' : `${seasonCode(nextSeasonNum)}`;
            const season = isMovie ? '' : ` season ${nextSeasonNum}`;
            const query = encodeURIComponent(`${item.title}${season} trailer`);
            addLink(`${name} trailer`, `https://www.youtube.com/results?search_query=${query}`);
        }
        // Poster image
        if (!item.posterUrl) {
            const query = encodeURIComponent(`${item.title} ${item.type} poster`);
            addLink('Poster search', `https://www.google.hu/search?q=${query}&tbm=isch`);
        }
        return links;
    }

    updateItem(updateFields) {
        const { item } = this.state;
        const { onChange } = this.props;
        onChange({
            ...item,
            ...updateFields
        });
    }

    render() {
        const { item, buttons, links } = this.state;
        const { visible } = this.props;
        const display = visible ? 'block' : 'none';
        const stateLabel = <StateLabel state={item.state} />;
        return (
            <div className="ItemDetails" style={{ display }}>
                <div className="ItemDetails-grid">
                    <div className="ItemDetails-sidebar">
                        <Poster item={item} />
                        {buttons}
                    </div>
                    <div className="ItemDetails-fields">
                        <DetailsRow label="Title" value={item.title} className="ItemDetails-title" />
                        <DetailsRow label="Type" value={item.type} />
                        <DetailsRow label="Genre" value={item.genres.join(', ') || 'Unkown'} />
                        <DetailsRow label="Notes" value={item.notes} optional />
                        <DetailsRow label="With Vali" value={item.withVali} />
                        <DetailsRow label="State" value={stateLabel} className="ItemDetails-state" />
                        <DetailsRow label="Links" value={links} />
                    </div>
                </div>
            </div>
        );
    }
}

ItemDetails.propTypes = {
    item: PropTypes.shape({}).isRequired,
    onChange: PropTypes.func.isRequired,
    visible: PropTypes.bool
};

ItemDetails.defaultProps = {
    visible: true
};

export default ItemDetails;
