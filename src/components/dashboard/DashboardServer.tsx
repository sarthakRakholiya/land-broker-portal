import { getLands } from "@/lib/data";
import { DashboardClient } from "./DashboardClient";

interface DashboardServerProps {
  searchParams: {
    page?: string;
    limit?: string;
    search?: string;
    location?: string;
    type?: string;
  };
}

export async function DashboardServer({ searchParams }: DashboardServerProps) {
  // Fetch initial lands data server-side
  const initialData = await getLands({
    page: parseInt(searchParams.page || "0"),
    limit: parseInt(searchParams.limit || "10"),
    search: searchParams.search || "",
    location: searchParams.location || "",
    type: searchParams.type || "",
  });

  return <DashboardClient initialData={initialData} />;
}
