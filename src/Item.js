import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Item extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const { match } = this.props;
        const { id } = match.params;
        return (
            <div className="Item">
                Item {id}
            </div>
        );
    }
}

Item.propTypes = {
    match: PropTypes.shape({
        params: PropTypes.shape({
            id: PropTypes.string.isRequired
        }).isRequired
    }).isRequired
};

export default Item;
