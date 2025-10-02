import { getLocations } from "@/lib/data";
import { LocationProvider } from "@/components/dashboard/LocationProvider";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Fetch locations server-side
  const initialLocations = await getLocations();

  return (
    <LocationProvider initialLocations={initialLocations}>
      {children}
    </LocationProvider>
  );
}
