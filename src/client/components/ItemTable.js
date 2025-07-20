import React from "react";
import PropTypes from "prop-types";
import { Table, TableBody, TableCell, TableHead, TableRow, Paper } from "@mui/material";
import ItemRow from "./ItemRow";
import { noop } from "../service/utils";
import "./ItemTable.css";

const ItemTable = ({ items = [], onRowClick = noop, currentId = null }) => {
  return (
    <Paper className="ItemTable-paper">
      <Table className="ItemTable">
        <TableHead className="ItemTable-head">
          <TableRow>
            <TableCell className="ItemTable-skinny-col">Type</TableCell>
            <TableCell>Title</TableCell>
            <TableCell className="only-desktop">Genre</TableCell>
            <TableCell className="only-desktop">State</TableCell>
            <TableCell className="only-desktop">Notes</TableCell>
            <TableCell>Vali</TableCell>
          </TableRow>
        </TableHead>
        <TableBody className="ItemTable-body">
          {items.map((item) => (
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
  onRowClick: PropTypes.func,
};

export default React.memo(ItemTable);
