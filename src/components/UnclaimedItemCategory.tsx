import { UnclaimedItem } from "@/types";

export const UnclaimedItemCategory = (props: {
  category: string;
  items: UnclaimedItem[];
}) => {
  return (
    <div>
      <h3> {props.category}</h3>
      <div>
        {props.items.map((item) => (
          <div
            key={item.progressionHash + "-" + item.rewardItem.rewardItemIndex}
            onClick={() => console.log(item)}
          >
            {item.itemDef.displayProperties.name}
          </div>
        ))}
      </div>
    </div>
  );
};
