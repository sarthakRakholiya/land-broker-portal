"use client";

import React, { createContext, useContext, useState } from "react";
import { Location } from "@/lib/data";
import { locationsService } from "@/services/locations";

interface LocationContextType {
  locations: Location[];
  loading: boolean;
  searchLocations: (query: string) => Promise<void>;
  createLocation: (name: string) => Promise<Location | null>;
  refreshLocations: () => Promise<void>;
}

const LocationContext = createContext<LocationContextType | undefined>(
  undefined
);

interface LocationProviderProps {
  children: React.ReactNode;
  initialLocations: Location[];
}

export function LocationProvider({
  children,
  initialLocations,
}: LocationProviderProps) {
  const [locations, setLocations] = useState<Location[]>(initialLocations);
  const [loading, setLoading] = useState(false);

  const searchLocations = async (query: string) => {
    if (!query.trim()) {
      setLocations(initialLocations);
      return;
    }

    try {
      setLoading(true);
      const searchResults = await locationsService.getLocations({
        search: query,
      });
      setLocations(searchResults);
    } catch (error) {
      console.error("Failed to search locations:", error);
    } finally {
      setLoading(false);
    }
  };

  const createLocation = async (name: string): Promise<Location | null> => {
    try {
      setLoading(true);
      const newLocation = await locationsService.createLocation({ name });
      if (newLocation) {
        setLocations((prev) =>
          [...prev, newLocation].sort((a, b) => a.name.localeCompare(b.name))
        );
        return newLocation;
      }
      return null;
    } catch (error) {
      console.error("Failed to create location:", error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const refreshLocations = async () => {
    try {
      setLoading(true);
      const allLocations = await locationsService.getLocations();
      setLocations(allLocations);
    } catch (error) {
      console.error("Failed to refresh locations:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LocationContext.Provider
      value={{
        locations,
        loading,
        searchLocations,
        createLocation,
        refreshLocations,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
}

export function useLocations() {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error("useLocations must be used within a LocationProvider");
  }
  return context;
}
