import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import './PosterSearch.css';
import { IconButton } from '@material-ui/core';

class PosterSearch extends PureComponent {
    render() {
        const { visible, searching, images, onSelect } = this.props;
        if (!visible) {
            return null;
        }
        const closeButton = (
            <IconButton className="PosterSearch-close" aria-label="Close posters" onClick={() => onSelect(null)}>
                <i className="material-icons">close</i>
            </IconButton>
        );
        return (
            <Paper className="PosterSearch">
                {searching && (
                    <div className="PosterSearch-searching">
                        <div className="PosterSearch-searching-bg" />
                        <i className="material-icons">cloud_download</i>
                        <span>Searching for poster images...</span>
                        {closeButton}
                    </div>
                )}
                {!searching && images.length === 0 && (
                    <div className="PosterSearch-notfound">
                        No suitable posters found.
                        {closeButton}
                    </div>
                )}
                {!searching && images.length > 0 && (
                    <div className="PosterSearch-images">
                        {images.map(image => (
                            <button key={image.url} type="button" className="PosterSearch-poster" onClick={() => onSelect(image.url)}>
                                <img src={image.url} alt="Poster" />
                            </button>
                        ))}
                        <div className="PosterSearch-fade left" />
                        <div className="PosterSearch-fade right" />
                        {closeButton}
                    </div>
                )}
            </Paper>
        );
    }
}

PosterSearch.propTypes = {
    visible: PropTypes.bool,
    searching: PropTypes.bool,
    images: PropTypes.arrayOf(PropTypes.shape({
        width: PropTypes.number.isRequired,
        height: PropTypes.number.isRequired,
        url: PropTypes.string.isRequired
    })),
    onSelect: PropTypes.func
};

PosterSearch.defaultProps = {
    visible: true,
    searching: false,
    images: [],
    onSelect: () => {}
};

export default PosterSearch;
