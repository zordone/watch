import React from 'react';
import PropTypes from 'prop-types';
import { ItemType } from '../common/enums';

const ItemIcon = ({ item }) => (
    item.type === ItemType.MOVIE
        ? <i className="material-icons">movie_creation</i>
        : <i className="material-icons">live_tv</i>
);

ItemIcon.propTypes = {
    item: PropTypes.shape({
        type: PropTypes.oneOf(Object.values(ItemType))
    }).isRequired
};

export default ItemIcon;
