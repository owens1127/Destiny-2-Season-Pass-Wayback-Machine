"use client";

import { BungieHttpClient } from "@/lib/BungieClient";
import { createContext, useState } from "react";

export const BungieHttpClientContext = createContext<BungieHttpClient | null>(
  null
);

export const BungieHttpClientProvider = ({
  children,
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
