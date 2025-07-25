import { Table, TableBody, TableCell, TableHead, TableRow, Paper } from "@mui/material";
import PropTypes from "prop-types";
import React from "react";
import { useIsMobile } from "../hooks/useIsMobile";
import { noop } from "../service/utils";
import { ItemRow } from "./ItemRow";
import "./ItemTable.css";

const ItemTableBase = ({ items = [], onRowClick = noop, currentId = null }) => {
  const { isDesktop } = useIsMobile();
  return (
    <Paper className="ItemTable-paper">
      <Table className="ItemTable">
        <TableHead className="ItemTable-head">
          <TableRow>
            <TableCell className="ItemTable-skinny-col">Type</TableCell>
            <TableCell>Title</TableCell>
            {isDesktop && (
              <>
                <TableCell>Genre</TableCell>
                <TableCell>State</TableCell>
                <TableCell>Notes</TableCell>
              </>
            )}
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

ItemTableBase.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object),
  currentId: PropTypes.string,
  onRowClick: PropTypes.func,
};

export const ItemTable = React.memo(ItemTableBase);
