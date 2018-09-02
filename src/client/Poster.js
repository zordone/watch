import React from 'react';
import PropTypes from 'prop-types';
import { IconButton } from '@material-ui/core';
import { ItemType } from '../common/enums';
import ItemIcon from './ItemIcon';
import './Poster.css';

const Poster = ({ item, onPosterSearch }) => {
    const style = {};
    if (item.posterUrl) {
        style.background = `url(${item.posterUrl}) no-repeat center / cover`;
    }
    return (
        <div className="Poster">
            <ItemIcon className="Poster-fallback" item={item} />
            <div className="Poster-image" style={style} />
            <IconButton className="Poster-search" aria-label="Poster search" onClick={onPosterSearch}>
                <i className="material-icons">cloud_download</i>
            </IconButton>
        </div>
    );
};

Poster.propTypes = {
    item: PropTypes.shape({
        type: PropTypes.oneOf(Object.values(ItemType))
    }).isRequired,
    onPosterSearch: PropTypes.func
};

Poster.defaultProps = {
    onPosterSearch: () => {}
};

export default Poster;
