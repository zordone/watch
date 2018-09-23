import React from 'react';
import PropTypes from 'prop-types';
import { ItemType } from '../../common/enums';

const ItemIcon = ({ item }) => (
    <i className={`ItemIcon material-icons ${item.type}`}>
        {item.type === ItemType.MOVIE ? 'movie_creation' : 'live_tv'}
    </i>
);

ItemIcon.propTypes = {
    item: PropTypes.shape({
        type: PropTypes.oneOf(Object.values(ItemType))
    }).isRequired
};

export default ItemIcon;
