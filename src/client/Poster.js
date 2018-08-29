import React from 'react';
import PropTypes from 'prop-types';
import { ItemType } from '../common/enums';
import ItemIcon from './ItemIcon';
import './Poster.css';

const Poster = ({ item }) => {
    const style = {};
    if (item.posterUrl) {
        style.background = `url(${item.posterUrl})`;
        style.backgroundSize = 'cover';
    }
    return (
        <div className="Poster">
            <ItemIcon className="Poster i" item={item} />
            <div className="Poster-image" style={style} />
        </div>
    );
};

Poster.propTypes = {
    item: PropTypes.shape({
        type: PropTypes.oneOf(Object.values(ItemType))
    }).isRequired
};

export default Poster;
