import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import IconButton from '@material-ui/core/IconButton';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import ItemIcon from './ItemIcon';
import StateLabel from './StateLabel';
import { maxLength } from './utils';

const ItemRow = ({ item }) => (
    <TableRow>
        <TableCell className="ItemTable-skinny-col">
            <ItemIcon item={item} />
        </TableCell>
        <TableCell component="th" scope="row">{item.title}</TableCell>
        <TableCell>{item.genres.join(', ')}</TableCell>
        <TableCell><StateLabel state={item.state} /></TableCell>
        <TableCell>{maxLength(item.notes, 50)}</TableCell>
        <TableCell>{item.withVali}</TableCell>
        <TableCell className="ItemTable-skinny-col">
            <IconButton
                key={`open-${item._id}`}
                component={NavLink}
                to={`/item/${item._id}`}
                aria-label="Open item details"
            >
                <i className="material-icons">input</i>
            </IconButton>
        </TableCell>
    </TableRow>
);

ItemRow.propTypes = {
    item: PropTypes.shape({}).isRequired
};

ItemRow.defaultProps = {
};

export default ItemRow;
