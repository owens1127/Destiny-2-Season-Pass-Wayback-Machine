import { DestinyActivityDefinition } from "bungie-net-core/models";
import { useCallback } from "react";
import { useDestinyManifestComponent } from "./useDestinyManifestComponent";

export const useGetActivityDefinition = () => {
  const { isSuccess, data } = useDestinyManifestComponent(
    "DestinyActivityDefinition"
  );

  return useCallback(
    (hash: number): DestinyActivityDefinition | null => {
      if (!isSuccess) {
        return null;
      }

      return data[hash] ?? null;
    },
    [isSuccess, data]
  );
};
