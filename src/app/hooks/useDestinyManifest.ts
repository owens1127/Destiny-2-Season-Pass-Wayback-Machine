import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { useBungie } from "@/app/components/providers/BungieHttpClientProvider";

export const useDestinyManifest = () => {
  const bungie = useBungie();
  return useQuery({
    queryKey: ["Destiny2Manifest"],
    queryFn: () => bungie.getManifest(),
    staleTime: 3600_000
  });
};

export const useDestinyManifestSuspended = () => {
  const bungie = useBungie();
  return useSuspenseQuery({
    queryKey: ["Destiny2Manifest"],
    queryFn: () => bungie.getManifest(),
    staleTime: 3600_000
  });
};
