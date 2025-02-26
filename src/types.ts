import { AllDestinyManifestComponents } from "bungie-net-core/manifest";
import {
  DestinyProgressionDefinition,
  DestinyProgressionRewardItemQuantity,
  DestinyProgressionRewardItemSocketOverrideState,
  DestinyProgressionRewardItemState,
  DestinySeasonDefinition,
} from "bungie-net-core/models";

export type UnclaimedItem = {
  characterId: string;
  membershipType: number;
  progressionHash: number;
  progressionDef: DestinyProgressionDefinition;
  rewardItem: DestinyProgressionRewardItemQuantity;
  rewardItemSocketOverrideStates: DestinyProgressionRewardItemSocketOverrideState;
  itemDef: AllDestinyManifestComponents["DestinyInventoryItemLiteDefinition"];
  seasonDef: DestinySeasonDefinition;
  state: DestinyProgressionRewardItemState;
};

export type ItemVariant = "currency" | "material" | "item" | "engram";
