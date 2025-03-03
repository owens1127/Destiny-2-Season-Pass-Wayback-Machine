import React from "react";
import { SquareMinus, SquarePlus } from "lucide-react";
import { ItemVariant, UnclaimedItem } from "@/types";
import { useCollapse } from "./CollapseManager";
import { SeasonPassItem } from "./Item";

export const UnclaimedItemCategory = ({
  category,
  items,
  variant = "item"
}: {
  category: string;
  items: UnclaimedItem[];
  variant?: ItemVariant;
}) => {
  const [isCollapsed, setIsCollapsed] = useCollapse(category);

  const sortedItems = React.useMemo(() => {
    if (variant === "currency" || variant === "material") {
      return items.toSorted((a, b) => {
        const diff = b.rewardItem.quantity - a.rewardItem.quantity;
        if (diff) {
          return diff;
        }
        const diff2 = b.seasonDef.seasonNumber - a.seasonDef.seasonNumber;
        if (diff2) {
          return diff2;
        }
        return (
          b.rewardItem.rewardedAtProgressionLevel -
          a.rewardItem.rewardedAtProgressionLevel
        );
      });
    } else if (variant === "item") {
      return items.toSorted((a, b) => {
        const diff =
          (b.itemDef.inventory?.tierType ?? 0) -
          (a.itemDef.inventory?.tierType ?? 0);
        if (diff) {
          return diff;
        }
        const diff2 = b.seasonDef.seasonNumber - a.seasonDef.seasonNumber;
        if (diff2) {
          return diff2;
        }
        const diff3 =
          b.rewardItem.rewardedAtProgressionLevel -
          a.rewardItem.rewardedAtProgressionLevel;
        if (diff3) {
          return diff3;
        }
        return a.itemCharacterClass - b.itemCharacterClass;
      });
    } else {
      return items.toSorted((a, b) => {
        const diff = b.seasonDef.seasonNumber - a.seasonDef.seasonNumber;
        if (diff) {
          return diff;
        }
        return (
          b.rewardItem.rewardedAtProgressionLevel -
          a.rewardItem.rewardedAtProgressionLevel
        );
      });
    }
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

  const CollapseIcon = isCollapsed ? SquarePlus : SquareMinus;

  return (
    <div className="w-full">
      <h3 className="flex items-center text-xl uppercase">
        {category}
        <CollapseIcon
          strokeWidth={1}
          className="ml-2 cursor-pointer"
          onClick={() => {
            setIsCollapsed((prev) => !prev);
          }}
        />
      </h3>
      <p className="text-md text-gray-200">
        <span className="font-semibold">
          {`${itemCount.toLocaleString()} item${itemCount !== 1 ? "s" : ""}`}
        </span>
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
      <hr className="my-2 border-t-2 border-gray-200" />
      {!isCollapsed && (
        <div className="relative grid grid-cols-[repeat(auto-fit,64px)] gap-x-4 gap-y-8 md:grid-cols-[repeat(auto-fit,96px)]">
          {sortedItems.map((item) => (
            <SeasonPassItem
              key={[item.progressionHash, item.rewardItem.rewardItemIndex].join(
                "-"
              )}
              variant={variant}
              item={item}
            />
          ))}
        </div>
      )}
    </div>
  );
};
