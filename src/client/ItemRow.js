import React from 'react';
import PropTypes from 'prop-types';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import ItemIcon from './ItemIcon';
import StateLabel from './StateLabel';
import { maxLength } from './utils';
import './ItemRow.css';

const ItemRow = ({ item, onClick, isCurrent }) => {
    const className = `ItemRow ${isCurrent ? 'current' : ''}`;
    return (
        <TableRow className={className} onClick={() => onClick(item._id)}>
            <TableCell className="ItemTable-skinny-col">
                <ItemIcon item={item} />
            </TableCell>
            <TableCell component="th" scope="row">{item.title}</TableCell>
            <TableCell>{item.genres.join(', ')}</TableCell>
            <TableCell><StateLabel state={item.state} /></TableCell>
            <TableCell>{maxLength(item.notes, 50)}</TableCell>
            <TableCell>{item.withVali}</TableCell>
        </TableRow>
    );
};

ItemRow.propTypes = {
    item: PropTypes.shape({}).isRequired,
    isCurrent: PropTypes.bool,
    onClick: PropTypes.func
};

ItemRow.defaultProps = {
    isCurrent: false,
    onClick: () => {}
};

export default ItemRow;
