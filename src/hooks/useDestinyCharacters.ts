import { useQuery } from "@tanstack/react-query";
import { useBungie } from "./useBungie";
import { useAuthorizedBungieSession } from "next-bungie-auth/client";
import { BungieMembershipType } from "bungie-net-core/models";

export const useProfileProgressions = (params: {
  destinyMembershipId: string;
  membershipType: BungieMembershipType;
}) => {
  const session = useAuthorizedBungieSession();
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
        accessToken: session.data.accessToken,
        destinyMembershipId: params.destinyMembershipId,
        membershipType: params.membershipType,
      }),
    select: (data) => ({
      characters: data.characters.data!,
      profileProgressions: data.characterProgressions.data!,
    }),
  });
};
