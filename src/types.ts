import { AllDestinyManifestComponents } from "bungie-net-core/manifest";
import {
  DestinyClass,
  DestinyProgressionDefinition,
  DestinyProgressionRewardItemQuantity,
  DestinyProgressionRewardItemSocketOverrideState,
  DestinyProgressionRewardItemState,
  DestinySeasonDefinition
} from "bungie-net-core/models";

export type UnclaimedItem = {
  characterId: string;
  characterClass: DestinyClass;
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
