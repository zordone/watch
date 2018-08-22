import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from '@material-ui/core';
import * as service from './service';
import './ItemDetails.css';

const DetailsRow = ({ label, value, className = '' }) => [
    <div className={`ItemDetails-label ${className}`}>{label}</div>,
    <div className={`ItemDetails-value ${className}`}>{value}</div>
];

class ItemDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            item: { ...service.defaultItem }
        };
    }

    componentWillReceiveProps(nextProps) {
        this.state = {
            item: { ...nextProps.item }
        };
    }

    render() {
        const { item } = this.state;
        return (
            <div className="ItemDetails">
                <div className="ItemDetails-grid">
                    <div className="ItemDetails-sidebar">
                        <div className="ItemDetails-poster">
                            Poster
                        </div>
                        <Button variant="contained" color="primary" className="ItemDetails-button">Watched</Button>
                    </div>
                    <div className="ItemDetails-fields">
                        <DetailsRow label="Title" value={item.title} className="ItemDetails-title" />
                        <DetailsRow label="Genre" value={item.genres.join(', ')} />
                        <DetailsRow label="Notes" value={item.notes} />
                        <DetailsRow label="State" value="Ready to watch" className="ItemDetails-state" />
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
