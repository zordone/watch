import React from "react";
import PropTypes from "prop-types";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import ItemRow from "./ItemRow";
import { noop } from "../service/utils";
import "./ItemTable.css";

const ItemTable = (props) => {
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
            <TableCell className="only-desktop">Genre</TableCell>
            <TableCell className="only-desktop">State</TableCell>
            <TableCell className="only-desktop">Notes</TableCell>
            <TableCell>Vali</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
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

ItemTable.defaultProps = {
  items: [],
  currentId: null,
  onRowClick: noop,
};

export default ItemTable;
