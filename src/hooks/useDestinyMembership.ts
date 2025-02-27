import { useQuery } from "@tanstack/react-query";
import { useBungie } from "./useBungie";

export const useDestinyMembership = () => {
  const bungie = useBungie();

  return useQuery({
    queryKey: ["membershipData"],
    queryFn: () => bungie.getMembershipData(),
    select: (data) =>
      data.destinyMemberships.find(
        (membership) => membership.membershipId === data.primaryMembershipId
      ) ??
      data.destinyMemberships.find(
        (membership) => membership.applicableMembershipTypes.length > 0
      ) ??
      data.destinyMemberships[0],
  });
};
