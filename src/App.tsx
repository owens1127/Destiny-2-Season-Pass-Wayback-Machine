"use client";

import { Suspense, useEffect } from "react";
import { toast } from "sonner";
import { Main } from "@/components/content/Main";
import { Skeleton } from "@/components/ui/skeleton";
import { useProfileProgressions } from "@/hooks/useDestinyCharacters";
import { useDestinyManifestComponent } from "@/hooks/useDestinyManifestComponent";
import { useDestinyMembership } from "@/hooks/useDestinyMembership";

export default function App() {
  // preloading
  useDestinyManifestComponent("DestinyActivityDefinition");
  useDestinyManifestComponent("DestinySeasonDefinition");
  useDestinyManifestComponent("DestinyInventoryItemLiteDefinition");

  const membershipQuery = useDestinyMembership();
  const progressionsQueryQuery = useProfileProgressions(
    membershipQuery.isSuccess
      ? {
          destinyMembershipId: membershipQuery.data.membershipId,
          membershipType: membershipQuery.data.membershipType
        }
      : {
          destinyMembershipId: "",
          membershipType: 0
        }
  );

  useEffect(() => {
    if (membershipQuery.isError) {
      toast.error("Error fetching membership data", {
        description: membershipQuery.error.message
      });
    }
  }, [membershipQuery.isError, membershipQuery.error]);

  useEffect(() => {
    if (progressionsQueryQuery.isError) {
      toast.error("Error fetching character data", {
        description: progressionsQueryQuery.error.message
      });
    }
  }, [progressionsQueryQuery.isError, progressionsQueryQuery.error]);

  if (
    membershipQuery.isPending ||
    membershipQuery.isError ||
    progressionsQueryQuery.isError
  ) {
    return null;
  }

  if (progressionsQueryQuery.isPending) {
    return <PageSkeleton />;
  }

  const profileProgressions = Object.values(
    Object.values(progressionsQueryQuery.data.profileProgressions)[0]
      .progressions
  );

  return (
    <Suspense fallback={<PageSkeleton />}>
      <Main
        profileProgressions={profileProgressions}
        characters={progressionsQueryQuery.data.characters}
      />
    </Suspense>
  );
}

const PageSkeleton = () => {
  return <Skeleton className="h-96 w-full" />;
};
