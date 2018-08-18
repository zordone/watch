import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import './ItemTable.css';

const ItemTable = props => {
    const { items } = props;
    return (
        <Paper>
            <Table className="ItemTable">
                <TableHead className="ItemTable-head">
                    <TableRow>
                        <TableCell>Title</TableCell>
                        <TableCell>Type</TableCell>
                        <TableCell className="ItemTable-skinny-col" />
                    </TableRow>
                </TableHead>
                <TableBody>
                    {items.map(item => (
                        <TableRow key={item.id}>
                            <TableCell component="th" scope="row">{item.title}</TableCell>
                            <TableCell>{item.type}</TableCell>
                            <TableCell className="ItemTable-skinny-col">
                                <Button component={NavLink} to={`/item/${item.id}`}>Edit</Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Paper>
    );
};

ItemTable.propTypes = {
    items: PropTypes.arrayOf(PropTypes.object)
};

ItemTable.defaultProps = {
    items: []
};

export default ItemTable;
