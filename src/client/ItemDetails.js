import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as service from './service';
import './ItemDetails.css';

const DetailsRow = ({ label, value }) => [
    <div className="ItemDetails-label">{label}</div>,
    <div className="ItemDetails-value">{value}</div>
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
                <DetailsRow label="Title" value={item.title} />
                <DetailsRow label="Genre" value={item.genres.join(', ')} />
            </div>
        );
    }
}

ItemDetails.propTypes = {
    item: PropTypes.shape({}).isRequired
};

export default ItemDetails;
