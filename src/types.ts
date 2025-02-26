import { AllDestinyManifestComponents } from "bungie-net-core/manifest";
import {
  DestinyProgressionDefinition,
  DestinyProgressionRewardItemQuantity,
  DestinyProgressionRewardItemState,
  DestinySeasonDefinition,
} from "bungie-net-core/models";

export type UnclaimedItem = {
  progressionHash: number;
  progressionDef: DestinyProgressionDefinition;
  rewardItem: DestinyProgressionRewardItemQuantity;
  itemDef: AllDestinyManifestComponents["DestinyInventoryItemLiteDefinition"];
  seasonDef: DestinySeasonDefinition;
  state: DestinyProgressionRewardItemState;
};
