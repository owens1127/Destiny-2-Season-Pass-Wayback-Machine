import { BungieHttpClientContext } from "@/components/providers/BungieHttpClientProvider";
import { useContext } from "react";

export const useBungie = () => {
  const ctx = useContext(BungieHttpClientContext);
  if (!ctx) {
    throw new Error("useBungie must be used within a BungieHttpClientProvider");
  }
  return ctx;
};
