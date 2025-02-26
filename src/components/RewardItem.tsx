import {
  DestinyDefinition,
  DestinyInventoryItemDefinition,
  DestinyProgressionRewardItemQuantity,
} from "bungie-net-core/models";

export const RewardItem = ({
  itemDef,
  reward,
}: {
  reward: DestinyProgressionRewardItemQuantity;
  itemDef: DestinyDefinition<DestinyInventoryItemDefinition> & {
    hash: never;
  };
}) => {
  return <div>{itemDef.displayProperties.name}</div>;
};
