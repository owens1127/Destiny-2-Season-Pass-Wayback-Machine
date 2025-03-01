import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useBungie } from "@/app/components/providers/BungieHttpClientProvider";

type ClaimRewardParams = Parameters<
  ReturnType<typeof useBungie>["claimSeasonPassReward"]
>[0];

export const useClaimItem = ({
  onSuccess,
  onError
}: {
  onError?: (error: Error, variables: ClaimRewardParams) => void;
  onSuccess?: (data: unknown, variables: ClaimRewardParams) => void;
} = {}) => {
  const bungie = useBungie();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["claimSeasonPassReward"],
    mutationFn: (args: ClaimRewardParams) => bungie.claimSeasonPassReward(args),
    onError,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["destinyProfileProgressions"]
      });
      onSuccess?.(data, variables);
    }
  });
};
