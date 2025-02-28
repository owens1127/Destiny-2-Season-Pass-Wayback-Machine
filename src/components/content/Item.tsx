import React from "react";
import { toast } from "sonner";
import { useClaimItem } from "@/hooks/useClaimItem";
import { cn } from "@/lib/utils";
import { ItemVariant, UnclaimedItem } from "@/types";

const classNameMap = {
  0: "Titan",
  1: "Hunter",
  2: "Warlock",
  3: "Unknown"
};

export const SeasonPassItem = React.memo(
  ({ item, variant }: { item: UnclaimedItem; variant: ItemVariant }) => {
    const [isClaimed, setIsClaimed] = React.useState(false);

    const quantity = item.rewardItem.quantity;
    const isShowQuantity = variant === "currency" || variant === "material";

    const claimItemMutation = useClaimItem({
      onError: (error) => {
        toast.error("Error claiming item", {
          description: error.message
        });
      },
      onSuccess: () => {
        toast.success("Item claimed", {
          description: `${quantity} ${item.itemDef.displayProperties.name}${
            quantity === 1 ? "" : "s"
          } has been transferred to the inventory of your ${
            classNameMap[item.characterClass]
          }`
        });
        setIsClaimed(true);
      }
    });

    return (
      <div
        className={cn(
          "group relative flex h-14 w-14 cursor-pointer flex-col items-center rounded-[0.125rem] border-2 border-gray-500 md:h-20 md:w-20",
          {
            "hover:scale-[1.03]": !isClaimed,
            "opacity-50": isClaimed,
            grayscale: isClaimed
          }
        )}
        onClick={() => {
          console.log(item);
          if (isClaimed) return;

          if (
            !window.confirm(
              [
                `Are you sure you want to claim ${quantity} ${
                  item.itemDef.displayProperties.name
                }${quantity === 1 ? "" : "s"} from ${
                  item.seasonDef.displayProperties.name
                }?`,
                `Note: This item will be transferred to the inventory of your ${
                  classNameMap[item.characterClass]
                }.`,
                "This action is irreversible."
              ].join("\n\n")
            )
          ) {
            return;
          }

          claimItemMutation.mutate({
            characterId: item.characterId,
            membershipType: item.membershipType,
            rewardIndex: item.rewardItem.rewardItemIndex,
            seasonHash: item.seasonDef.hash,
            progressionHash: item.progressionHash
          });
        }}
      >
        <img
          src={`https://www.bungie.net${item.itemDef.displayProperties.icon}`}
          alt={item.itemDef.displayProperties.name}
          className="absolute h-full w-full object-cover"
        />
        {item.itemDef.iconWatermark && (
          <img
            src={`https://www.bungie.net${item.itemDef.iconWatermark}`}
            className="absolute h-full w-full object-cover"
            alt=""
          />
        )}

        <div className="max-h:full bottom-[90%] mb-1 max-w-full rounded bg-black/95 p-3 text-white opacity-0 group-hover:absolute group-hover:max-h-none group-hover:max-w-none group-hover:min-w-[150%] group-hover:opacity-100">
          <p className="text-lg text-nowrap">
            {item.itemDef.displayProperties.name}
          </p>
          <p className="text-sm text-gray-400">
            {`${item.seasonDef.displayProperties.name} (${item.seasonDef.seasonNumber})`}
          </p>
          <p className="text-sm text-gray-200">
            {`Rank ${item.rewardItem.rewardItemIndex}`}
          </p>
        </div>

        {isShowQuantity && (
          <div
            className={cn(
              "absolute right-0 bottom-0 rounded-sm bg-black/70 px-2 text-sm text-white transition-opacity",
              {
                "text-base": quantity < 100
              }
            )}
          >
            <span className="font-semibold">{quantity.toLocaleString()}</span>
          </div>
        )}
      </div>
    );
  }
);
SeasonPassItem.displayName = "SeasonPassItem";
