import { DashboardServer } from "@/components/dashboard/DashboardServer";

interface DashboardPageProps {
  searchParams: Promise<{
    page?: string;
    limit?: string;
    search?: string;
    location?: string;
    type?: string;
  }>;
}

export default async function Dashboard({ searchParams }: DashboardPageProps) {
  const resolvedSearchParams = await searchParams;
  return <DashboardServer searchParams={resolvedSearchParams} />;
}
