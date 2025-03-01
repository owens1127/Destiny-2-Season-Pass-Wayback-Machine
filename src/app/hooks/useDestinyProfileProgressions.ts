import { useQuery } from "@tanstack/react-query";
import { BungieMembershipType } from "bungie-net-core/models";
import { useBungie } from "@/app/components/providers/BungieHttpClientProvider";

export const useProfileProgressions = (params: {
  destinyMembershipId: string;
  membershipType: BungieMembershipType;
}) => {
  const bungie = useBungie();

  return useQuery({
    enabled: params.destinyMembershipId !== "",
    queryKey: [
      "destinyProfileProgressions",
      params.membershipType,
      params.destinyMembershipId
    ],
    queryFn: () => bungie.getProfileProgressions(params),
    select: (data) => ({
      characters: data.characters.data!,
      profileProgressions: data.characterProgressions.data!
    }),
    staleTime: 60_000
  });
};
