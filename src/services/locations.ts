import { apiClient } from "./apiClient";

export interface Location {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateLocationRequest {
  name: string;
}

export interface GetLocationsParams {
  search?: string;
  [key: string]: string | number | undefined;
}

class LocationsService {
  async getLocations(params: GetLocationsParams = {}): Promise<Location[]> {
    // Filter out undefined values to match Record<string, string | number>
    const filteredParams = Object.fromEntries(
      Object.entries(params).filter(([, value]) => value !== undefined)
    ) as Record<string, string | number>;

    return apiClient.get<Location[]>("/locations", filteredParams);
  }

  async createLocation(data: CreateLocationRequest): Promise<Location> {
    return apiClient.post<Location>("/locations", data);
  }
}

export const locationsService = new LocationsService();
