import { useQueries } from "@tanstack/react-query";
import { useBungie } from "./useBungie";
import { useAuthorizedBungieSession } from "next-bungie-auth/client";
import {
  BungieMembershipType,
  DestinyHistoricalStatsPeriodGroup,
} from "bungie-net-core/models";

export const useActivityHistory = (params: {
  destinyMembershipId: string;
  membershipType: BungieMembershipType;
  characterIds: string[];
}) => {
  const session = useAuthorizedBungieSession();
  const bungie = useBungie();

  return useQueries({
    combine: (results) => {
      const reduced = results.reduce(
        (acc, result) => ({
          data: new Map([
            ...acc.data,
            ...(result.data?.map(
              (a) => [a.activityDetails.instanceId, a] as const
            ) ?? []),
          ]),
          isError: acc.isError || result.isError,
          error: acc.error ?? result.error,
          isPending: acc.isPending || result.isPending,
          isSuccess: acc.isSuccess && result.isSuccess,
        }),
        {
          data: new Map<
            string,
            DestinyHistoricalStatsPeriodGroup & {
              characterId: string;
            }
          >(),
          isError: false,
          error: null as Error | null,
          isPending: false,
          isSuccess: true,
        }
      );

      return {
        ...reduced,
        data: Array.from(reduced.data.values()).sort(
          (a, b) => new Date(b.period).getTime() - new Date(a.period).getTime()
        ),
      };
    },
    queries: params.characterIds.map((characterId) => ({
      staleTime: 300_000,
      retry: 1,
      enabled: !!params.characterIds.length,
      queryKey: [
        "activity history",
        params.membershipType,
        params.destinyMembershipId,
        characterId,
      ],
      queryFn: () =>
        bungie.getActivityHistory({
          accessToken: session.data.accessToken,
          destinyMembershipId: params.destinyMembershipId,
          membershipType: params.membershipType,
          characterId,
        }),
    })),
  });
};
