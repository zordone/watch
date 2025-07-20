import React from "react";
import PropTypes from "prop-types";
import { useVirtualizer } from "@tanstack/react-virtual";
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableRow, Paper } from "@mui/material";
import { noop } from "../service/utils";
import ItemIcon from "./ItemIcon";
import StateLabel from "./StateLabel";
import "./ItemTable.css";

const columns = [
  {
    accessorKey: "type",
    header: "Type",
    className: "ItemTable-skinny-col",
    flex: "0 0 26px",
    cell: (info) => <ItemIcon item={info.row.original} />,
  },
  {
    accessorKey: "title",
    header: "Title",
    scope: "row",
    flex: "1 1 200px",
    cell: (info) => (
      <>
        <div className="title">{info.row.original.title}</div>
        <div className="only-mobile">{info.row.original.genres.join(", ")}</div>
        <StateLabel className="only-mobile" state={info.row.original.state} />
      </>
    ),
  },
  {
    accessorKey: "genre",
    header: "Genre",
    className: "only-desktop",
    flex: "1 1 180px",
    cell: (info) => info.row.original.genres.join(", "),
  },
  {
    accessorKey: "state",
    header: "State",
    className: "only-desktop",
    flex: "1 1 180px",
    cell: (info) => <StateLabel state={info.row.original.state} />,
  },
  {
    accessorKey: "notes",
    header: "Notes",
    className: "only-desktop",
    flex: "1 1 100px",
    cell: (info) => (info.row.original.notes ?? "").slice(0, 50),
  },
  {
    accessorKey: "vali",
    header: "Vali",
    flex: "0 0 60px",
    cell: (info) => info.row.original.withVali,
  },
];

const ItemTable = ({ items = [], onRowClick = noop, currentId = null }) => {
  const tableContainerRef = React.useRef(null);

  const table = useReactTable({
    data: items,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <Paper className="ItemTable-paper">
      <div ref={tableContainerRef} className="ItemTable-virtualContainer">
        <Table className="ItemTable" style={{ display: "grid" }}>
          <TableHead className="ItemTable-head">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const { className, flex } = header.column.columnDef;
                  return (
                    <TableCell key={header.id} className={className} style={{ flex }}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableHead>
          <ItemTableBodyWrapper
            table={table}
            tableContainerRef={tableContainerRef}
            onRowClick={onRowClick}
            currentId={currentId}
          />
        </Table>
      </div>
    </Paper>
  );
};

ItemTable.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object),
  currentId: PropTypes.string,
  onRowClick: PropTypes.func,
};

const ItemTableBodyWrapper = ({ table, tableContainerRef, onRowClick, currentId }) => {
  const rowRefsMap = React.useRef(new Map());

  const tableState = table.getState();
  const { rows } = table.getRowModel();

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    estimateSize: () => 43, // estimates row height for accurate scrollbar dragging
    getScrollElement: () => tableContainerRef.current,
    measureElement: (element) => element?.getBoundingClientRect().height,
    overscan: 5,
    onChange: (instance) => {
      instance.getVirtualItems().forEach((virtualRow) => {
        const rowRef = rowRefsMap.current.get(virtualRow.index);
        if (!rowRef) return;
        rowRef.style.transform = `translateY(${virtualRow.start}px)`;
        rowRef.classList.add("transform-set");
      });
    },
  });

  React.useLayoutEffect(() => {
    rowVirtualizer.measure();
  }, [tableState, rowVirtualizer]);

  return (
    <ItemTableBody
      rowRefsMap={rowRefsMap}
      rowVirtualizer={rowVirtualizer}
      table={table}
      onRowClick={onRowClick}
      currentId={currentId}
    />
  );
};

ItemTableBodyWrapper.propTypes = {
  table: PropTypes.object.isRequired,
  tableContainerRef: PropTypes.object.isRequired,
  onRowClick: PropTypes.func,
  currentId: PropTypes.string,
};

const ItemTableBody = ({ rowVirtualizer, table, rowRefsMap, onRowClick, currentId }) => {
  const { rows } = table.getRowModel();
  const virtualRowIndexes = rowVirtualizer.getVirtualIndexes();
  return (
    <TableBody style={{ height: `${rowVirtualizer.getTotalSize()}px` }}>
      {virtualRowIndexes.map((virtualRowIndex) => {
        const row = rows[virtualRowIndex];
        const itemId = row.original._id;
        const currentClassName = itemId === currentId ? "current" : "";
        return (
          <TableBodyRowMemo
            key={row.id}
            row={row}
            rowRefsMap={rowRefsMap}
            rowVirtualizer={rowVirtualizer}
            virtualRowIndex={virtualRowIndex}
            className={`ItemTable-row ${currentClassName}`}
            onClick={(event) => onRowClick(itemId, event.metaKey)}
          />
        );
      })}
    </TableBody>
  );
};

ItemTableBody.propTypes = {
  rowVirtualizer: PropTypes.object.isRequired,
  table: PropTypes.object.isRequired,
  rowRefsMap: PropTypes.object.isRequired,
  onRowClick: PropTypes.func,
  currentId: PropTypes.string,
};

const TableBodyRow = ({ row, rowRefsMap, rowVirtualizer, virtualRowIndex, className }) => {
  return (
    <TableRow
      data-index={virtualRowIndex}
      ref={(node) => {
        if (node && virtualRowIndex >= 0) {
          rowVirtualizer.measureElement(node);
          rowRefsMap.current.set(virtualRowIndex, node);
        }
      }}
      key={row.id}
      className={className}
    >
      {row.getVisibleCells().map((cell) => {
        const { className, scope, flex } = cell.column.columnDef;
        return (
          <TableCell key={cell.id} className={className} scope={scope} style={{ flex }}>
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </TableCell>
        );
      })}
    </TableRow>
  );
};

TableBodyRow.propTypes = {
  row: PropTypes.object.isRequired,
  rowRefsMap: PropTypes.object.isRequired,
  rowVirtualizer: PropTypes.object.isRequired,
  virtualRowIndex: PropTypes.number.isRequired,
  className: PropTypes.string,
};

const TableBodyRowMemo = React.memo(TableBodyRow);

export default React.memo(ItemTable);
