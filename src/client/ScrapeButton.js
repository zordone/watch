import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import IconButton from '@material-ui/core/IconButton';
import CloudDownload from '@material-ui/icons/CloudDownload';
import './ScrapeButton.css';

class ScrapeButton extends PureComponent {
    render() {
        const { visible, className, ariaLabel, inProgress, onClick } = this.props;
        const visibleClassName = visible ? '' : 'hidden';
        const progressClassName = inProgress ? 'progress' : '';
        return (
            <IconButton
                className={`ScrapeButton ${className} ${progressClassName} ${visibleClassName}`}
                aria-label={ariaLabel}
                onClick={onClick}
            >
                <CloudDownload />
            </IconButton>
        );
    }
}

ScrapeButton.propTypes = {
    className: PropTypes.string,
    visible: PropTypes.bool,
    ariaLabel: PropTypes.string.isRequired,
    inProgress: PropTypes.bool,
    onClick: PropTypes.func
};

ScrapeButton.defaultProps = {
    className: '',
    visible: true,
    inProgress: false,
    onClick: () => {}
};

export default ScrapeButton;
