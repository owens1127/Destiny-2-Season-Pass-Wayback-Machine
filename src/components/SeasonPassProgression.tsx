import React from "react";
import {
  DestinyProgression,
  DestinyProgressionDefinition,
  DestinySeasonDefinition,
} from "bungie-net-core/models";
import { RewardItem } from "./RewardItem";
import { useDestinyManifestComponentsSuspended } from "@/hooks/useDestinyManifestComponent";

export const SeasonPassProgression = React.memo(
  ({
    progression,
    seasonDef,
    progressionDef,
  }: {
    progression: DestinyProgression;
    seasonDef: DestinySeasonDefinition;
    progressionDef: DestinyProgressionDefinition;
  }) => {
    const [itemDefs] = useDestinyManifestComponentsSuspended([
      "DestinyInventoryItemLiteDefinition",
    ]);
    const unclaimedItems = React.useMemo(() => {
      const unclaimedRewards = progression.rewardItemStates
        .map((state, rewardIndex) => ({
          state,
          rewardIndex,
        }))
        .filter(({ state }) => {
          // the bitmap for the item must be earned (2), but not claimed (4)
          return (state & 2) === 2 && (state & 4) !== 4;
        });

      return progressionDef.rewardItems
        .filter((itemRewardDef) =>
          unclaimedRewards.some(
            (unclaimedItem) =>
              unclaimedItem.rewardIndex === itemRewardDef.rewardItemIndex
          )
        )
        .map((itemRewardDef) => ({
          reward: itemRewardDef,
          itemDef: itemDefs.data[itemRewardDef.itemHash],
        }));
    }, [
      itemDefs.data,
      progression.rewardItemStates,
      progressionDef.rewardItems,
    ]);

    return (
      <div className="w-full">
        <h3>{seasonDef.displayProperties.name}</h3>
        <div className="flex flex-wrap gap-2">
          {unclaimedItems.map((item) => (
            <RewardItem key={item.reward.rewardItemIndex} {...item} />
          ))}
        </div>
      </div>
    );
  }
);
SeasonPassProgression.displayName = "SeasonPassProgression";
