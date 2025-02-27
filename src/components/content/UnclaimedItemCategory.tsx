import { ItemVariant, UnclaimedItem } from "@/types";
import { SeasonPassItem } from "./SeasonPassItem";
import React from "react";

export const UnclaimedItemCategory = ({
  category,
  items,
  variant = "item",
}: {
  category: string;
  items: UnclaimedItem[];
  variant?: ItemVariant;
}) => {
  const sortedItems = React.useMemo(() => {
    if (variant === "currency" || variant === "material") {
      return items.toSorted((a, b) => {
        const diff = b.rewardItem.quantity - a.rewardItem.quantity;
        if (diff) {
          return diff;
        }
        return b.seasonDef.seasonNumber - a.seasonDef.seasonNumber;
      });
    } else if (variant === "item") {
      return items.toSorted((a, b) => {
        const diff =
          (b.itemDef.inventory?.tierType ?? 0) -
          (a.itemDef.inventory?.tierType ?? 0);
        if (diff) {
          return diff;
        }
        return b.seasonDef.seasonNumber - a.seasonDef.seasonNumber;
      });
    } else {
      return items.toSorted(
        (a, b) => b.seasonDef.seasonNumber - a.seasonDef.seasonNumber
      );
    }

    return items;
  }, [items, variant]);

  if (items.length === 0) {
    return null;
  }

  const itemCount = items.length;
  const totalQuantity = items.reduce(
    (acc, item) => acc + item.rewardItem.quantity,
    0
  );

  const isShowQuantity =
    variant === "currency" ||
    (variant === "material" && totalQuantity !== itemCount);

  return (
    <div className="w-full">
      <h3 className="text-xl uppercase"> {category}</h3>
      <p className="text-md text-gray-200">
        <span className="font-semibold">{itemCount.toLocaleString()}</span> item
        {itemCount === 1 ? "" : "s"}
        {isShowQuantity && (
          <>
            {" • "}
            <span className="font-semibold">
              {totalQuantity.toLocaleString()}
            </span>{" "}
            total
          </>
        )}
      </p>
      <hr className="border-t-2 border-gray-300 my-2" />
      <div className="grid grid-cols-[repeat(auto-fit,96px)] gap-4 relative">
        {sortedItems.map((item) => (
          <SeasonPassItem
            key={item.progressionHash + "-" + item.rewardItem.rewardItemIndex}
            variant={variant}
            item={item}
          />
        ))}
      </div>
    </div>
  );
};
