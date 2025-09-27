export const LAND_TYPES = [
  { value: "land", label: "Land" },
  { value: "house", label: "House" },
  { value: "apartment", label: "Apartment" },
  { value: "commercial", label: "Commercial" },
  { value: "industrial", label: "Industrial" },
  { value: "agricultural", label: "Agricultural" },
] as const;

export const DEFAULT_LOCATIONS = [
  "Mumbai",
  "Delhi",
  "Bangalore",
  "Chennai",
  "Kolkata",
  "Hyderabad",
  "Pune",
  "Ahmedabad",
  "Surat",
  "Jaipur",
] as const;

export type LandType = (typeof LAND_TYPES)[number]["value"];
export type Location = (typeof DEFAULT_LOCATIONS)[number] | string;

export interface LandRecord {
  id: string;
  fullName: string;
  mobileNo: string;
  location: {
    id: string;
    name: string;
  };
  landArea: number;
  landAreaUnit: "sqft" | "acres" | "bigha" | "hectare";
  type: LandType;
  totalPrice: number;
  pricePerArea: number;
  createdAt: Date;
  updatedAt: Date;
}

export const LAND_AREA_UNITS = [
  { value: "sqft", label: "Square Feet" },
  { value: "acres", label: "Acres" },
  { value: "bigha", label: "Bigha" },
  { value: "hectare", label: "Hectare" },
] as const;
