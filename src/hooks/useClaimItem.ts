import { useMutation } from "@tanstack/react-query";
import { useBungie } from "@/components/providers/BungieHttpClientProvider";

type ClaimRewardParams = Parameters<
  ReturnType<typeof useBungie>["claimSeasonPassReward"]
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
    ...opts
  });
};
