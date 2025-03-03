import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useBungie } from "@/app/components/providers/BungieHttpClientProvider";

type ClaimRewardParams = Parameters<
  ReturnType<typeof useBungie>["claimSeasonPassReward"]
>[0];

export const useClaimItem = (
  args: ClaimRewardParams,
  {
    onSuccess,
    onError
  }: {
    onError?: (error: Error) => void;
    onSuccess?: (data: unknown) => void;
  } = {}
) => {
  const bungie = useBungie();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["claimSeasonPassReward"],
    mutationFn: () => bungie.claimSeasonPassReward(args),
    onError,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["destinyProfileProgressions"]
      });
      onSuccess?.(data);
    }
  });
};
