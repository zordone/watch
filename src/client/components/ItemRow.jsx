import { TableRow, TableCell } from "@mui/material";
import PropTypes from "prop-types";
import { useIsMobile } from "../hooks/useIsMobile";
import { maxLength, noop } from "../service/utils";
import { ItemIcon } from "./ItemIcon";
import { itemPropType } from "./propTypes";
import { StateLabel } from "./StateLabel";
import "./ItemRow.css";

export const ItemRow = ({ item, onClick = noop, isCurrent = false }) => {
  const { isMobile, isDesktop } = useIsMobile();

  const className = `ItemRow ${isCurrent ? "current" : ""}`;
  return (
    <TableRow className={className} onClick={(event) => onClick(item._id, event.metaKey)}>
      <TableCell className="type">
        <ItemIcon item={item} />
      </TableCell>
      <TableCell scope="row">
        {isDesktop && item.title}
        {isMobile && (
          <>
            <div className="title">{item.title}</div>
            <div>{item.genres.join(", ")}</div>
            <StateLabel item={item} />
          </>
        )}
      </TableCell>
      {isDesktop && (
        <>
          <TableCell>{item.genres.join(", ")}</TableCell>
          <TableCell>
            <StateLabel item={item} />
          </TableCell>
          <TableCell>{maxLength(item.notes, 50)}</TableCell>
        </>
      )}
      <TableCell className="vali">{item.withVali}</TableCell>
    </TableRow>
  );
};

ItemRow.propTypes = {
  item: itemPropType,
  isCurrent: PropTypes.bool,
  onClick: PropTypes.func,
};
