import { useQuery } from "@tanstack/react-query";
import { useBungie } from "./useBungie";
import { useAuthorizedBungieSession } from "next-bungie-auth/client";

export const useDestinyMembership = () => {
  const session = useAuthorizedBungieSession();
  const bungie = useBungie();

  return useQuery({
    queryKey: ["membershipData", session.data.bungieMembershipId],
    queryFn: () => bungie.getMembershipData(session.data),
    select: (data) =>
      data.profiles.sort(
        (a, b) =>
          new Date(b.dateLastPlayed).getTime() -
          new Date(a.dateLastPlayed).getTime()
      )[0],
  });
};
