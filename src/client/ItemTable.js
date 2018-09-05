import React from 'react';
import PropTypes from 'prop-types';
import { Table, TableBody, TableCell, TableHead, TableRow, Paper } from '@material-ui/core';
import ItemRow from './ItemRow';
import './ItemTable.css';

const ItemTable = props => {
    const { items, onRowClick, currentId } = props;
    const isEmpty = items.length === 0;
    return (
        <Paper className="ItemTable-paper">
            <div className="ItemTable-fixedHeader">
                {!isEmpty && <div className="ItemTable-fixedHeaderShadow" />}
            </div>
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
                        <ItemRow
                            key={item._id}
                            item={item}
                            onClick={onRowClick}
                            isCurrent={item._id === currentId}
                        />
                    ))}
                </TableBody>
            </Table>
        </Paper>
    );
};

ItemTable.propTypes = {
    items: PropTypes.arrayOf(PropTypes.object),
    currentId: PropTypes.string,
    onRowClick: PropTypes.func
};

ItemTable.defaultProps = {
    items: [],
    currentId: null,
    onRowClick: () => {}
};

export default ItemTable;
