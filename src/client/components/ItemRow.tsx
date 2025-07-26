import { TableRow, TableCell } from "@mui/material";
import { ParsedItem } from "@common/types";
import { useIsMobile } from "../hooks/useIsMobile";
import { maxLength, noop } from "../service/utils";
import { ItemIcon } from "./ItemIcon";
import { StateLabel } from "./StateLabel";
import "./ItemRow.css";

interface ItemRowProps {
  item: ParsedItem;
  isCurrent?: boolean;
  onClick?: (id: string, isCmd: boolean) => void;
}

export const ItemRow = ({ item, onClick = noop, isCurrent = false }: ItemRowProps) => {
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
