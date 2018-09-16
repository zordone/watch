import React from 'react';
import PropTypes from 'prop-types';
import { ItemType } from '../common/enums';
import ItemIcon from './ItemIcon';
import ScrapeButton from './ScrapeButton';
import './Poster.css';

const Poster = ({ item, onPosterSearch, posterScraping }) => {
    const style = {};
    if (item.posterUrl) {
        style.background = `url(${item.posterUrl}) no-repeat center / cover`;
    }
    return (
        <div className="Poster">
            <ItemIcon className="Poster-fallback" item={item} />
            <div className="Poster-image" style={style} />
            <ScrapeButton
                className="Poster-search"
                ariaLabel="Poster search"
                inProgress={posterScraping}
                onClick={onPosterSearch}
            />
        </div>
    );
};

Poster.propTypes = {
    item: PropTypes.shape({
        type: PropTypes.oneOf(Object.values(ItemType))
    }).isRequired,
    posterScraping: PropTypes.bool,
    onPosterSearch: PropTypes.func
};

Poster.defaultProps = {
    posterScraping: false,
    onPosterSearch: () => {}
};

export default Poster;
