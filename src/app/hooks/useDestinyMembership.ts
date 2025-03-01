import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useBungie } from "@/app/components/providers/BungieHttpClientProvider";
import { getCookie } from "@/app/lib/cookie";

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
  }, []);

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
    }
  });
};
