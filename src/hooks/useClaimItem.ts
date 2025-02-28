import { useMutation } from "@tanstack/react-query";
import { useBungie } from "./useBungie";
import { BungieHttpClient } from "@/lib/BungieClient";

type ClaimRewardParams = Parameters<
  BungieHttpClient["claimSeasonPassReward"]
>[0];

export const useClaimItem = (
  opts: {
    onError?: (error: Error, variables: ClaimRewardParams) => void;
    onSuccess?: (data: unknown, variables: ClaimRewardParams) => void;
  } = {}
) => {
  const bungie = useBungie();

  return useMutation({
    mutationFn: (args: ClaimRewardParams) => bungie.claimSeasonPassReward(args),

    ...opts,
  });
};
