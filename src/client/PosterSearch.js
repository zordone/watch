import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import './PosterSearch.css';

class PosterSearch extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            failedUrls: []
        };
        this.onFailedImage = this.onFailedImage.bind(this);
    }

    onFailedImage(event) {
        const { failedUrls } = this.state;
        const url = event.target.attributes.src.value;
        this.setState({
            failedUrls: [...failedUrls, url]
        });
    }

    render() {
        const { visible, searching, images, onSelect } = this.props;
        const { failedUrls } = this.state;
        if (!visible) {
            return null;
        }
        const filteredImages = images
            .filter(image => !failedUrls.includes(image.url));
        return (
            <Paper className="PosterSearch">
                {searching && (
                    <div className="PosterSearch-searching">
                        <div className="PosterSearch-searching-bg" />
                        <i className="material-icons">cloud_download</i>
                        <span>Searching for poster images...</span>
                    </div>
                )}
                {!searching && filteredImages.length === 0 && (
                    <div className="PosterSearch-notfound">
                        No suitable posters found.
                    </div>
                )}
                {!searching && filteredImages.length > 0 && (
                    <div className="PosterSearch-images">
                        {filteredImages
                            .map(image => (
                                <button key={image.url} type="button" className="PosterSearch-poster" onClick={() => onSelect(image.url)}>
                                    <img
                                        src={image.url}
                                        alt="Poster"
                                        onError={this.onFailedImage}
                                    />
                                </button>
                            ))
                        }
                        <div className="PosterSearch-fade left" />
                        <div className="PosterSearch-fade right" />
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
