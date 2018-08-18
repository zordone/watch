import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as service from './service';

class Item extends Component {
    constructor(props) {
        super(props);
        this.state = {
            item: {}
        };
    }

    componentDidMount() {
        const { match } = this.props;
        const { id } = match.params;
        service.getItemById(id)
            .then(item => {
                this.setState({ item });
            });
    }

    render() {
        // const { match } = this.props;
        // const { id } = match.params;
        const { item } = this.state;
        return (
            <div className="Item">
                Item: {item._id}
                <br />
                Title: {item.title}
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
