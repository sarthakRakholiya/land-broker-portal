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
}

class LocationsService {
  async getLocations(params: GetLocationsParams = {}): Promise<Location[]> {
    return apiClient.get<Location[]>("/locations", params);
  }

  async createLocation(data: CreateLocationRequest): Promise<Location> {
    return apiClient.post<Location>("/locations", data);
  }
}

export const locationsService = new LocationsService();
