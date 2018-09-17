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
            <TableCell component="th" scope="row">
                <div className="title">{item.title}</div>
                <div className="only-mobile">{item.genres.join(', ')}</div>
                <StateLabel className="only-mobile" state={item.state} />
            </TableCell>
            <TableCell className="only-desktop">{item.genres.join(', ')}</TableCell>
            <TableCell className="only-desktop"><StateLabel state={item.state} /></TableCell>
            <TableCell className="only-desktop">{maxLength(item.notes, 50)}</TableCell>
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
