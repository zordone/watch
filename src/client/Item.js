import React, { Component } from 'react';
import PropTypes from 'prop-types';

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
        fetch(`http://localhost:3001/items/${id}`)
            .then(res => res.json())
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
