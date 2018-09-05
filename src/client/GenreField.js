import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import ChipInputAutoComplete from './ChipInputAutoComplete';
import data from '../common/data.json';

class GenreField extends PureComponent {
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
        const { onChange, className, style, ...rest } = this.props;
        return (
            <ChipInputAutoComplete
                onAdd={this.onAddGenre}
                onDelete={this.onDeleteGenre}
                dataSource={data.genres}
                className={`GenreField ${className}`}
                containerStyle={style}
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

export default GenreField;
