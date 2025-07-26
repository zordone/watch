import { Table, TableBody, TableCell, TableHead, TableRow, Paper } from "@mui/material";
import React from "react";
import { ParsedItem } from "@common/types";
import { useIsMobile } from "../hooks/useIsMobile";
import { noop } from "../service/utils";
import { ItemRow } from "./ItemRow";
import "./ItemTable.css";

interface ItemTableProps {
  items?: ParsedItem[];
  currentId?: string | null;
  onRowClick?: (id: string, isCmd: boolean) => void;
}

const ItemTableBase = ({ items = [], onRowClick = noop, currentId = null }: ItemTableProps) => {
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

export const ItemTable = React.memo(ItemTableBase);
