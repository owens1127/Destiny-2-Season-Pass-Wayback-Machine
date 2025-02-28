import { useQuery } from "@tanstack/react-query";
import { useBungie } from "./useBungie";
import { useEffect, useState } from "react";
import { getCookie } from "@/lib/cookie";

export const useDestinyMembership = () => {
  const bungie = useBungie();
  const [bungieMembershipId, setBungieMembershipId] = useState(() =>
    getCookie("bungleme")
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setBungieMembershipId(getCookie("bungleme"));
    }, 1000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [window.location.href]);

  return useQuery({
    enabled: !!bungieMembershipId,
    queryKey: ["membershipData", bungieMembershipId],
    queryFn: () => bungie.getLinkedProfiles(bungieMembershipId),
    select: (data) => {
      const d2Profiles = data.profiles.toSorted(
        (a, b) =>
          new Date(b.dateLastPlayed).getTime() -
          new Date(a.dateLastPlayed).getTime()
      );

      return (
        d2Profiles.find(
          (profile) => profile.applicableMembershipTypes.length > 0
        ) ?? d2Profiles[0]
      );
    },
  });
};
