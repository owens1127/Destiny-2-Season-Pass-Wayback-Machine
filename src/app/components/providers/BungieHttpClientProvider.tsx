"use client";

import { createContext, useContext, useState } from "react";
import { BungieHttpClient } from "@/app/lib/BungieClient";

export const BungieHttpClientContext = createContext<BungieHttpClient | null>(
  null
);

export const BungieHttpClientProvider = ({
  children
}: {
  children?: React.ReactNode;
}) => {
  const [client] = useState(() => new BungieHttpClient());

  return (
    <BungieHttpClientContext.Provider value={client}>
      {children}
    </BungieHttpClientContext.Provider>
  );
};

export const useBungie = () => {
  const ctx = useContext(BungieHttpClientContext);
  if (!ctx) {
    throw new Error("useBungie must be used within a BungieHttpClientProvider");
  }
  return ctx;
};
