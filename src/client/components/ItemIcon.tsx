import { Movie, Tv } from "@mui/icons-material";
import { Type } from "@common/enums";
import { ParsedItem } from "@common/types";

const Icons: Record<Type, React.ElementType> = {
  [Type.MOVIE]: Movie,
  [Type.SHOW]: Tv,
};

interface ItemIconProps {
  item: ParsedItem;
  className?: string;
}

export const ItemIcon = ({ item, className = "" }: ItemIconProps) => {
  const Icon = Icons[item.type];
  return <Icon className={`ItemIcon ${item.type} ${className}`} />;
};
