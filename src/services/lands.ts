import { LandRecord } from "@/constants/lands";
import { apiClient } from "./apiClient";

export interface LandCreateData {
  fullName: string;
  mobileNo: string;
  locationId: string;
  landArea: number;
  landAreaUnit: string;
  type: string;
  totalPrice: number;
}

export interface LandUpdateData extends LandCreateData {
  id: string;
}

export interface LandsResponse {
  lands: LandRecord[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

class LandsService {
  async getLands(
    params: {
      page?: number;
      limit?: number;
      search?: string;
      location?: string;
      type?: string;
    } = {}
  ): Promise<LandsResponse> {
    return apiClient.get<LandsResponse>("/lands", params);
  }

  async createLand(data: LandCreateData): Promise<LandRecord> {
    return apiClient.post<LandRecord>("/lands", data);
  }

  async updateLand(data: LandUpdateData): Promise<LandRecord> {
    return apiClient.put<LandRecord>(`/lands/${data.id}`, data);
  }

  async deleteLand(id: string): Promise<void> {
    return apiClient.delete<void>(`/lands/${id}`);
  }

  async getLand(id: string): Promise<LandRecord> {
    return apiClient.get<LandRecord>(`/lands/${id}`);
  }
}

export const landsService = new LandsService();
