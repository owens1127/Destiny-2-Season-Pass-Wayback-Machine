"use client";

import {
  BungieSessionProvider,
  BungieSessionSuspender,
} from "next-bungie-auth/client";
import { ReactNode } from "react";
import { NextBungieAuthSessionResponse } from "next-bungie-auth/types";
import { useToast } from "@/hooks/useToast";
import { Unauthorized } from "@/components/auth/Unauthorized";
import { BungieHttpClientProvider } from "./BungieHttpClientProvider";

/**
 * Provides a client component for managing the Bungie session.
 *
 * @param serverSession - The server session for NextBungieAuth.
 * @param children - The child components.
 * @returns The session provider component.
 */
export const CustomSessionProvider = ({
  serverSession,
  children,
}: {
  serverSession?: NextBungieAuthSessionResponse;
  children?: ReactNode;
}) => {
  const { toast } = useToast();

  return (
    <BungieSessionProvider
      initialSession={serverSession}
      onError={(err, type) => {
        toast({
          title: `${type.charAt(0).toUpperCase() + type.slice(1)} Error`,
          description: err.message,
          variant: "destructive",
        });
      }}
    >
      <BungieSessionSuspender fallback={(state) => <Unauthorized {...state} />}>
        <BungieHttpClientProvider>{children}</BungieHttpClientProvider>
      </BungieSessionSuspender>
    </BungieSessionProvider>
  );
};
