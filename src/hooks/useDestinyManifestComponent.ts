import {
  useQuery,
  useSuspenseQueries,
  UseSuspenseQueryResult,
} from "@tanstack/react-query";
import { useBungie } from "./useBungie";
import {
  useDestinyManifest,
  useDestinyManifestSuspended,
} from "./useDestinyManifest";
import {
  AllDestinyManifestComponents,
  DestinyManifestDefinition,
} from "bungie-net-core/manifest";

export const useDestinyManifestComponent = <
  T extends keyof AllDestinyManifestComponents
>(
  tableName: T
) => {
  const bungie = useBungie();
  const manifestQuery = useDestinyManifest();

  return useQuery({
    enabled: manifestQuery.isSuccess,
    queryKey: ["Destiny2ManifestComponent", tableName],
    queryFn: () => bungie.getManifestComponent(tableName, manifestQuery.data!),
    staleTime: 3600_000,
  });
};

export const useDestinyManifestComponentsSuspended = <
  T extends readonly (keyof AllDestinyManifestComponents)[]
>(
  tableNames: [...T]
): {
  [K in keyof T]: UseSuspenseQueryResult<
    Record<string, DestinyManifestDefinition<T[K]>>,
    Error
  >;
} => {
  const bungie = useBungie();
  const manifestQuery = useDestinyManifestSuspended();

  return useSuspenseQueries({
    queries: tableNames.map((tableName) => ({
      queryKey: ["Destiny2ManifestComponent", tableName],
      queryFn: () => bungie.getManifestComponent(tableName, manifestQuery.data),
      staleTime: 3600_000,
    })),
  });
};
