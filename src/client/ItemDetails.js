import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from '@material-ui/core';
import * as service from './service';
import Poster from './Poster';
import './ItemDetails.css';
import StateLabel from './StateLabel';

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
        this.setState({
            item: { ...nextProps.item }
        });
    }

    render() {
        const { item } = this.state;
        const stateLabel = <StateLabel state={item.state} />;
        return (
            <div className="ItemDetails">
                <div className="ItemDetails-grid">
                    <div className="ItemDetails-sidebar">
                        <Poster item={item} />
                        <Button variant="contained" color="primary" className="ItemDetails-button">Watched</Button>
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
    item: PropTypes.shape({}).isRequired
};

export default ItemDetails;
