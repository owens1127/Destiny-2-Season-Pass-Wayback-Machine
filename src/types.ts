import {
  DestinyCharacterComponent,
  DestinyClass,
  DestinyInventoryItemDefinition,
  DestinyProgressionDefinition,
  DestinyProgressionRewardItemQuantity,
  DestinyProgressionRewardItemSocketOverrideState,
  DestinyProgressionRewardItemState,
  DestinySeasonDefinition,
  DestinySeasonPassDefinition
} from "bungie-net-core/models";

export type UnclaimedItem = {
  transferCharacter: DestinyCharacterComponent;
  itemCharacterClass: DestinyClass;
  membershipType: number;
  progressionHash: number;
  progressionDef: DestinyProgressionDefinition;
  rewardItem: DestinyProgressionRewardItemQuantity;
  rewardItemSocketOverrideStates: DestinyProgressionRewardItemSocketOverrideState;
  itemDef: DestinyInventoryItemDefinition;
  seasonDef: DestinySeasonDefinition;
  seasonPassDef: DestinySeasonPassDefinition;
  state: DestinyProgressionRewardItemState;
  canClaimThisSeason: boolean;
};

export type ItemVariant = "currency" | "material" | "item" | "engram";
