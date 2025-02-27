"use client";

import { Main } from "@/components/content/Main";
import { PageSkeleton } from "@/components/PageSkeleton";
import { useProfileProgressions } from "@/hooks/useDestinyCharacters";

import { useDestinyManifestComponent } from "@/hooks/useDestinyManifestComponent";
import { useDestinyMembership } from "@/hooks/useDestinyMembership";
import { useToast } from "@/hooks/useToast";
import { Suspense, useEffect } from "react";

export default function App() {
  // preloading
  useDestinyManifestComponent("DestinyActivityDefinition");
  useDestinyManifestComponent("DestinySeasonDefinition");
  useDestinyManifestComponent("DestinyInventoryItemLiteDefinition");

  const { toast } = useToast();

  const membershipQuery = useDestinyMembership();
  const progressionsQueryQuery = useProfileProgressions(
    membershipQuery.isSuccess
      ? {
          destinyMembershipId: membershipQuery.data.membershipId,
          membershipType: membershipQuery.data.membershipType,
        }
      : {
          destinyMembershipId: "",
          membershipType: 0,
        }
  );

  useEffect(() => {
    if (membershipQuery.isError) {
      toast({
        title: "Error fetching membership data",
        description: membershipQuery.error.message,
        variant: "destructive",
      });
    }
  }, [toast, membershipQuery.isError, membershipQuery.error]);

  useEffect(() => {
    if (progressionsQueryQuery.isError) {
      toast({
        title: "Error fetching character data",
        description: progressionsQueryQuery.error.message,
        variant: "destructive",
      });
    }
  }, [toast, progressionsQueryQuery.isError, progressionsQueryQuery.error]);

  if (membershipQuery.isPending || progressionsQueryQuery.isPending) {
    return <PageSkeleton />;
  }

  if (membershipQuery.isError || progressionsQueryQuery.isError) {
    return null;
  }

  const profileProgressions = Object.values(
    Object.values(progressionsQueryQuery.data.profileProgressions)[0]
      .progressions
  );

  return (
    <Suspense>
      <Main
        profileProgressions={profileProgressions}
        characters={progressionsQueryQuery.data.characters}
      />
    </Suspense>
  );
}
