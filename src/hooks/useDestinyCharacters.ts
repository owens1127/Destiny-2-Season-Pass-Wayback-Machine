import { useQuery } from "@tanstack/react-query";
import { useBungie } from "./useBungie";
import { BungieMembershipType } from "bungie-net-core/models";

export const useProfileProgressions = (params: {
  destinyMembershipId: string;
  membershipType: BungieMembershipType;
}) => {
  const bungie = useBungie();

  return useQuery({
    enabled: params.destinyMembershipId !== "",
    queryKey: [
      "getBasicProfile",
      params.membershipType,
      params.destinyMembershipId,
    ],
    queryFn: () =>
      bungie.getProfileProgressions({
        destinyMembershipId: params.destinyMembershipId,
        membershipType: params.membershipType,
      }),
    select: (data) => ({
      characters: data.characters.data!,
      profileProgressions: data.characterProgressions.data!,
    }),
  });
};
