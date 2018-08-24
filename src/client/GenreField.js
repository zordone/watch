import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import ChipInput from 'material-ui-chip-input';
import _ from 'lodash';
import data from '../common/data.json';

const styles = {
    chipContainer: {
        minHeight: 'unset',
        // without the important, a `.chipContainer.labeled` class overrides this to 18.
        marginTop: '16px !important',
        display: 'inline-flex',
        overflow: 'scroll'
    },
    chip: {
        height: '26px'
    }
};

class GenreField extends Component {
    constructor(props) {
        super(props);
        this.onAddGenre = this.onAddGenre.bind(this);
        this.onDeleteGenre = this.onDeleteGenre.bind(this);
    }

    onAddGenre(genre) {
        const { value } = this.props;
        this.fireOnChanged(value.concat(genre));
    }

    onDeleteGenre(genre, index) {
        const { value } = this.props;
        const newValue = [...value];
        newValue.splice(index, 1);
        this.fireOnChanged(newValue);
    }

    fireOnChanged(value) {
        const { onChange, id, value: oldValue } = this.props;
        if (_.isEqual(oldValue, value)) {
            return;
        }
        const event = {
            target: { id, value }
        };
        onChange(event);
    }

    render() {
        const { onChange, className, classes, ...rest } = this.props;
        // TODO: seems like autocomplete is not working (1.0.0-beta)
        return (
            <ChipInput
                onAdd={this.onAddGenre}
                onDelete={this.onDeleteGenre}
                dataSource={data.genres}
                className={`GenreField ${className}`}
                classes={classes}
                {...rest}
            />
        );
    }
}

GenreField.propTypes = {
    id: PropTypes.string,
    className: PropTypes.string,
    style: PropTypes.shape({}),
    label: PropTypes.string,
    value: PropTypes.arrayOf(PropTypes.string).isRequired,
    onChange: PropTypes.func
};

GenreField.defaultProps = {
    id: undefined,
    className: '',
    style: {},
    label: undefined,
    onChange: () => {}
};

export default withStyles(styles)(GenreField);
