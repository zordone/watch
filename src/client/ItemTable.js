import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import ItemIcon from './ItemIcon';
import StateLabel from './StateLabel';
import './ItemTable.css';

const ItemTable = props => {
    const { items } = props;
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
                        <TableCell className="ItemTable-skinny-col" />
                    </TableRow>
                </TableHead>
                <TableBody>
                    {items.map(item => (
                        <TableRow key={item._id}>
                            <TableCell className="ItemTable-skinny-col">
                                <ItemIcon item={item} />
                            </TableCell>
                            <TableCell component="th" scope="row">{item.title}</TableCell>
                            <TableCell>{item.genres.join(', ')}</TableCell>
                            <TableCell><StateLabel state={item.state} /></TableCell>
                            <TableCell>{item.notes}</TableCell>
                            <TableCell>{item.withVali}</TableCell>
                            <TableCell className="ItemTable-skinny-col">
                                <IconButton
                                    component={NavLink}
                                    to={`/item/${item._id}`}
                                    aria-label="Edit the item"
                                >
                                    <i className="material-icons">input</i>
                                </IconButton>
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
