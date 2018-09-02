import React from 'react';
import PropTypes from 'prop-types';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import ItemRow from './ItemRow';
import './ItemTable.css';

const ItemTable = props => {
    const { items, onRowClick } = props;
    return (
        <Paper className="ItemTable-paper">
            <Table className="ItemTable">
                <TableHead className="ItemTable-head">
                    <TableRow>
                        <TableCell className="ItemTable-skinny-col">Type</TableCell>
                        <TableCell>Title</TableCell>
                        <TableCell>Genre</TableCell>
                        <TableCell>State</TableCell>
                        <TableCell>Notes</TableCell>
                        <TableCell>Vali</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {items.map(item => (
                        <ItemRow key={item._id} item={item} onClick={onRowClick} />
                    ))}
                </TableBody>
            </Table>
        </Paper>
    );
};

ItemTable.propTypes = {
    items: PropTypes.arrayOf(PropTypes.object),
    onRowClick: PropTypes.func
};

ItemTable.defaultProps = {
    items: [],
    onRowClick: () => {}
};

export default ItemTable;
