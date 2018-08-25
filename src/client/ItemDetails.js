import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from '@material-ui/core';
import * as service from './service';
import Poster from './Poster';
import './ItemDetails.css';
import StateLabel from './StateLabel';
import { ItemType, FinishedType, StateType, NextType } from '../common/enums';
import { inputDateAddMonth, parseDate, season } from './utils';

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
        this.setState({
            item: { ...item },
            buttons
        });
    }

    getButtons(item) {
        const buttons = [];
        const addButton = (label, onClick) => {
            buttons.push(
                <Button key={label} variant="contained" color="primary" className="ItemDetails-button" onClick={onClick}>{label}</Button>
            );
        };
        const isMovie = item.type === ItemType.MOVIE;
        const isWaitingOrRecheck = [StateType.WAITING, StateType.RECHECK].includes(item.state.type);
        const nextSeasonNum = !isMovie && (parseInt(item.lastWatched, 10) || 0) + 1;
        // TODO: no buttons for new item
        if (item.state.type === StateType.FINISHED) {
            return buttons;
        }
        if (isWaitingOrRecheck) {
            const name = isMovie ? 'Movie' : season(nextSeasonNum);
            addButton(`${name} is available now`, () => {
                this.updateItem({
                    nextDate: parseDate(new Date()).input,
                    nextType: NextType.AVAILABLE
                });
            });
            addButton('Recheck a month later', () => {
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
                addButton(`Start watching ${season(nextSeasonNum)}`, () => {
                    this.updateItem({
                        inProgress: nextSeasonNum,
                        nextDate: '',
                        nextType: ''
                    });
                });
            }
        }
        if (item.state.type === StateType.PROGRESS && !isMovie) {
            addButton(`Finished ${season(item.inProgress)}`, () => {
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

    updateItem(updateFields) {
        const { item } = this.state;
        const { onChange } = this.props;
        onChange({
            ...item,
            ...updateFields
        });
    }

    render() {
        const { item, buttons } = this.state;
        const stateLabel = <StateLabel state={item.state} />;
        return (
            <div className="ItemDetails">
                <div className="ItemDetails-grid">
                    <div className="ItemDetails-sidebar">
                        <Poster item={item} />
                        {buttons}
                    </div>
                    <div className="ItemDetails-fields">
                        <DetailsRow label="Title" value={item.title} className="ItemDetails-title" />
                        <DetailsRow label="Genre" value={item.genres.join(', ') || 'Unkown'} />
                        <DetailsRow label="Notes" value={item.notes} optional />
                        <DetailsRow label="State" value={stateLabel} className="ItemDetails-state" />
                    </div>
                </div>
            </div>
        );
    }
}

ItemDetails.propTypes = {
    item: PropTypes.shape({}).isRequired,
    onChange: PropTypes.func.isRequired
};

export default ItemDetails;
