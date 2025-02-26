import { Skeleton } from "@/components/ui/skeleton";

export const PageSkeleton = () => {
  return (
    <main className="min-h-screen flex flex-col items-center">
      <Skeleton className="h-12 w-72 md:w-48" />
    </main>
  );
};
