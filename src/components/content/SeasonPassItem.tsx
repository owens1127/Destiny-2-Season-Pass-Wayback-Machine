import { useToast } from "@/hooks/useToast";
import { cn } from "@/lib/utils";
import { ItemVariant, UnclaimedItem } from "@/types";
import { useMutation } from "@tanstack/react-query";
import { BungieNetResponse } from "bungie-net-core/models";
import Image from "next/image";
import React, { useCallback } from "react";

const BungieNetApiKey = "10E792629C2A47E19356B8A79EEFA640";

export const SeasonPassItem = React.memo(
  ({ item, variant }: { item: UnclaimedItem; variant: ItemVariant }) => {
    const quantity = item.rewardItem.quantity;
    const isShowQuantity = variant === "currency" || variant === "material";

    const { toast } = useToast();

    const claimItem = useCallback(async () => {
      const response = await fetch(
        "https://www.bungie.net/Platform/Destiny2/Actions/Seasons/ClaimReward/",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "x-api-key": BungieNetApiKey,
            "x-csrf":
              document.cookie
                .split("; ")
                .find((row) => row.startsWith("bungled="))
                ?.split("=")[1] ?? "",
          },
          body: JSON.stringify({
            characterId: item.characterId,
            membershipType: item.membershipType,
            rewardIndex: item.rewardItem.rewardItemIndex,
            seasonHash: item.seasonDef.hash,
            progressionHash: item.progressionHash,
          }),
        }
      );

      if (response.headers.get("Content-Type")?.includes("application/json")) {
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.Message, {
            cause: data,
          });
        }

        return data as BungieNetResponse<unknown>;
      } else {
        throw new Error(response.statusText, {
          cause: response,
        });
      }
    }, [
      item.characterId,
      item.membershipType,
      item.progressionHash,
      item.rewardItem.rewardItemIndex,
      item.seasonDef.hash,
    ]);

    const claimItemMutation = useMutation({
      mutationFn: claimItem,
      onError: (error) => {
        toast({
          title: "Error claiming reward",
          description: error.message,
          variant: "destructive",
          duration: 5000,
        });
      },
    });

    return (
      <div
        className="cursor-pointer flex flex-col items-center border-2 border-gray-500 rounded w-20 h-20 relative group hover:scale-[1.03]"
        onClick={() => {
          console.log(item);
          claimItemMutation.mutate();
        }}
      >
        <Image
          unoptimized
          src={`https://www.bungie.net${item.itemDef.displayProperties.icon}`}
          fill
          alt={item.itemDef.displayProperties.name}
        />
        {item.itemDef.iconWatermark && (
          <Image
            unoptimized
            src={`https://www.bungie.net${item.itemDef.iconWatermark}`}
            fill
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
