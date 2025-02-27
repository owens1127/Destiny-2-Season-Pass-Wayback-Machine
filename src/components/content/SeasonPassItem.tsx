import { useClaimItem } from "@/hooks/useClaimItem";
import { useToast } from "@/hooks/useToast";
import { cn } from "@/lib/utils";
import { ItemVariant, UnclaimedItem } from "@/types";
import React from "react";

export const SeasonPassItem = React.memo(
  ({ item, variant }: { item: UnclaimedItem; variant: ItemVariant }) => {
    const quantity = item.rewardItem.quantity;
    const isShowQuantity = variant === "currency" || variant === "material";

    const { toast } = useToast();

    const claimItemMutation = useClaimItem({
      onError: (error) => {
        toast({
          title: "Error claiming item",
          description: error.message,
          variant: "destructive",
        });
      },
      onSuccess: () => {
        toast({
          title: "Item claimed",
          description: "Item has been claimed",
          variant: "default",
        });
      },
    });

    return (
      <div
        className="cursor-pointer flex flex-col items-center border-2 border-gray-500 rounded w-20 h-20 relative group hover:scale-[1.03]"
        onClick={() => {
          console.log(item);
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

        <div className="opacity-0 group-hover:opacity-100 group-hover:absolute max-w-full group-hover:max-w-none bg-slate-950 text-white text-sm rounded py-1 px-2 bottom-[90%] mb-1">
          <p className="text-nowrap">{item.itemDef.displayProperties.name}</p>
          <p className="text-gray-400 text-sm">
            {item.seasonDef.displayProperties.name} (
            {item.seasonDef.seasonNumber})
          </p>
        </div>

        {isShowQuantity && (
          <div
            className={cn(
              "absolute bottom-0 right-0 px-2 bg-black bg-opacity-75 text-white text-sm transition-opacity",
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
