import { useClaimItem } from "@/hooks/useClaimItem";
import { cn } from "@/lib/utils";
import { ItemVariant, UnclaimedItem } from "@/types";
import React from "react";
import { toast } from "sonner";

const classNameMap = {
  0: "Titan",
  1: "Hunter",
  2: "Warlock",
  3: "Unknown",
};

export const SeasonPassItem = React.memo(
  ({ item, variant }: { item: UnclaimedItem; variant: ItemVariant }) => {
    const [isClaimed, setIsClaimed] = React.useState(false);

    const quantity = item.rewardItem.quantity;
    const isShowQuantity = variant === "currency" || variant === "material";

    const claimItemMutation = useClaimItem({
      onError: (error) => {
        toast.error("Error claiming item", {
          description: error.message,
        });
      },
      onSuccess: () => {
        toast.success("Item claimed", {
          description: `${quantity} ${item.itemDef.displayProperties.name}${
            quantity === 1 ? "" : "s"
          } has been transferred to the inventory of your ${
            classNameMap[item.characterClass]
          }`,
        });
        setIsClaimed(true);
      },
    });

    return (
      <div
        className={cn(
          "cursor-pointer flex flex-col items-center border-2 border-gray-500 rounded-[0.125rem] w-14 h-14 md:w-20 md:h-20 relative group ",
          {
            "hover:scale-[1.03]": !isClaimed,
            "opacity-50": isClaimed,
            grayscale: isClaimed,
          }
        )}
        onClick={() => {
          console.log(item);
          if (isClaimed) return;

          if (
            !window.confirm(
              `Are you sure you want to claim ${quantity} ${
                item.itemDef.displayProperties.name
              }${quantity === 1 ? "" : "s"} from ${
                item.seasonDef.displayProperties.name
              }?\nThis action is irreversible.`
            )
          ) {
            return;
          }

          claimItemMutation.mutate({
            characterId: item.characterId,
            membershipType: item.membershipType,
            rewardIndex: item.rewardItem.rewardItemIndex,
            seasonHash: item.seasonDef.hash,
            progressionHash: item.progressionHash,
          });
        }}
      >
        <img
          src={`https://www.bungie.net${item.itemDef.displayProperties.icon}`}
          alt={item.itemDef.displayProperties.name}
          className="absolute w-full h-full object-cover"
        />
        {item.itemDef.iconWatermark && (
          <img
            src={`https://www.bungie.net${item.itemDef.iconWatermark}`}
            className="absolute w-full h-full object-cover"
            alt=""
          />
        )}

        <div className="opacity-0 group-hover:opacity-100 group-hover:absolute max-w-full group-hover:min-w-[150%] group-hover:max-w-none max-h:full group-hover:max-h-none bg-black/95 text-white rounded p-3 bottom-[90%] mb-1">
          <p className="text-lg text-nowrap">
            {item.itemDef.displayProperties.name}
          </p>
          <p className=" text-sm text-gray-400">
            {`${item.seasonDef.displayProperties.name} (${item.seasonDef.seasonNumber}), rank ${item.rewardItem.rewardItemIndex}`}
          </p>
        </div>

        {isShowQuantity && (
          <div
            className={cn(
              "absolute bottom-0 right-0 px-2 bg-black/70 text-white text-sm transition-opacity rounded-sm",
              {
                "text-base": quantity < 100,
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
