import { DashboardSkeleton } from "@/components/ui/loading-skeleton";

export default function DashboardLoading() {
  return (
    <div className="p-8">
      <DashboardSkeleton />
    </div>
  );
}
