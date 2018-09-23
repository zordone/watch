import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import ChipInput from 'material-ui-chip-input';
import _ from '../common/lodashReduced';
import './ChipArrayInput.css';
import { noop } from './service/utils';

class ChipArrayInput extends PureComponent {
    constructor(props) {
        super(props);
        this.onAdd = this.onAdd.bind(this);
        this.onDelete = this.onDelete.bind(this);
    }

    onAdd(item) {
        const { value } = this.props;
        this.fireOnChanged(value.concat(item));
    }

    onDelete(item, index) {
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
        return (
            <ChipInput
                onAdd={this.onAdd}
                onDelete={this.onDelete}
                className={`ChipArrayInput ${className}`}
                classes={{
                    chipContainer: 'chipContainer',
                    chip: 'chip',
                    label: 'label'
                }}
                {...rest}
            />
        );
    }
}

ChipArrayInput.propTypes = {
    id: PropTypes.string,
    className: PropTypes.string,
    style: PropTypes.shape({}),
    label: PropTypes.string,
    value: PropTypes.arrayOf(PropTypes.string).isRequired,
    onChange: PropTypes.func
};

ChipArrayInput.defaultProps = {
    id: undefined,
    className: '',
    style: {},
    label: undefined,
    onChange: noop
};

export default ChipArrayInput;
