import { TableRow, TableCell } from "@mui/material";
import PropTypes from "prop-types";
import { StateType, ValiType } from "../../common/enums";
import { maxLength, noop } from "../service/utils";
import { ItemIcon } from "./ItemIcon";
import { StateLabel } from "./StateLabel";
import "./ItemRow.css";

export const ItemRow = ({ item, onClick = noop, isCurrent = false }) => {
  const className = `ItemRow ${isCurrent ? "current" : ""}`;
  return (
    <TableRow className={className} onClick={(event) => onClick(item._id, event.metaKey)}>
      <TableCell className="ItemTable-skinny-col">
        <ItemIcon item={item} />
      </TableCell>
      <TableCell scope="row">
        <div className="title">{item.title}</div>
        <div className="only-mobile">{item.genres.join(", ")}</div>
        <StateLabel className="only-mobile" item={item} />
      </TableCell>
      <TableCell className="only-desktop">{item.genres.join(", ")}</TableCell>
      <TableCell className="only-desktop">
        <StateLabel item={item} />
      </TableCell>
      <TableCell className="only-desktop">{maxLength(item.notes, 50)}</TableCell>
      <TableCell>{item.withVali}</TableCell>
    </TableRow>
  );
};

ItemRow.propTypes = {
  item: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    genres: PropTypes.arrayOf(PropTypes.string).isRequired,
    state: PropTypes.shape({
      type: PropTypes.oneOf(Object.values(StateType)),
    }),
    notes: PropTypes.string,
    withVali: PropTypes.oneOf(Object.values(ValiType)),
  }).isRequired,
  isCurrent: PropTypes.bool,
  onClick: PropTypes.func,
};
