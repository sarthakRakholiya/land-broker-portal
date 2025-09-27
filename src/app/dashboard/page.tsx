"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Box, Container, Fade } from "@mui/material";
import { ProtectedRoute } from "@/components/common/ProtectedRoute";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { LandsTable } from "@/components/dashboard/LandsTable";
import { LandsFilters } from "@/components/dashboard/LandsFilters";
import { AddEditLandModal } from "@/components/dashboard/AddEditLandModal";
import { LandRecord } from "@/constants/lands";
// import { useLanguage } from "@/contexts/LanguageContext";
import { landsService } from "@/services/lands";
import { toast } from "@/utils/toast";

// Mock data for demonstration
const mockLands: LandRecord[] = [
  {
    id: "1",
    fullName: "Rajesh Kumar Patel",
    mobileNo: "9876543210",
    location: { id: "mock-mumbai", name: "Mumbai" },
    landArea: 1000,
    landAreaUnit: "sqft",
    type: "land",
    totalPrice: 5000000,
    pricePerArea: 5000,
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    id: "2",
    fullName: "Priya Sharma",
    mobileNo: "9123456789",
    location: { id: "mock-delhi", name: "Delhi" },
    landArea: 2,
    landAreaUnit: "acres",
    type: "agricultural",
    totalPrice: 8000000,
    pricePerArea: 4000000,
    createdAt: new Date("2024-01-20"),
    updatedAt: new Date("2024-01-20"),
  },
  {
    id: "3",
    fullName: "Amit Singh Rajput",
    mobileNo: "9988776655",
    location: { id: "mock-bangalore", name: "Bangalore" },
    landArea: 1500,
    landAreaUnit: "sqft",
    type: "house",
    totalPrice: 12000000,
    pricePerArea: 8000,
    createdAt: new Date("2024-01-25"),
    updatedAt: new Date("2024-01-25"),
  },
  {
    id: "4",
    fullName: "Sunita Devi",
    mobileNo: "9876123450",
    location: { id: "mock-chennai", name: "Chennai" },
    landArea: 3,
    landAreaUnit: "bigha",
    type: "commercial",
    totalPrice: 15000000,
    pricePerArea: 5000000,
    createdAt: new Date("2024-02-01"),
    updatedAt: new Date("2024-02-01"),
  },
  {
    id: "5",
    fullName: "Vikram Singh",
    mobileNo: "9123987456",
    location: { id: "mock-pune", name: "Pune" },
    landArea: 800,
    landAreaUnit: "sqft",
    type: "apartment",
    totalPrice: 6500000,
    pricePerArea: 8125,
    createdAt: new Date("2024-02-05"),
    updatedAt: new Date("2024-02-05"),
  },
];

function DashboardContent() {
  const [lands, setLands] = useState<LandRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingLand, setEditingLand] = useState<LandRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  // Language context available if needed

  // Fetch lands from API
  const fetchLands = useCallback(async () => {
    try {
      setLoading(true);
      const response = await landsService.getLands({
        page,
        limit: rowsPerPage,
        search: searchTerm,
        location: locationFilter,
        type: typeFilter,
      });
      setLands(response.lands);
      setTotalCount(response.pagination.total);
    } catch (error) {
      console.error("Failed to fetch lands:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch lands";
      toast.error("Error", errorMessage);
      // Fallback to mock data for development
      setLands(mockLands);
      setTotalCount(mockLands.length);
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, searchTerm, locationFilter, typeFilter]);

  // Fetch lands when filters change
  useEffect(() => {
    fetchLands();
  }, [fetchLands]);

  // Filter and search logic (now handled by API)
  const filteredLands = lands;

  // Pagination is now handled by the API
  const paginatedLands = filteredLands;

  // Note: Location filtering is now handled directly in LandsFilters component

  const handleAddLand = () => {
    setEditingLand(null);
    setModalOpen(true);
  };

  const handleEditLand = (land: LandRecord) => {
    setEditingLand(land);
    setModalOpen(true);
  };

  const handleSaveLand = async (
    landData: Omit<
      LandRecord,
      "id" | "createdAt" | "updatedAt" | "pricePerArea"
    >
  ) => {
    try {
      // Convert location object to locationId for API
      const apiData = {
        ...landData,
        locationId:
          typeof landData.location === "string"
            ? landData.location
            : landData.location.id,
        // Convert to uppercase for API
        type: landData.type.toUpperCase(),
        landAreaUnit: landData.landAreaUnit.toUpperCase(),
      };

      // Remove the location object from the data sent to API
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { location: _location, ...apiDataWithoutLocation } = apiData;

      if (editingLand) {
        // Update existing land
        await landsService.updateLand({
          ...apiDataWithoutLocation,
          id: editingLand.id,
        });
        toast.success("Success", "Land record updated successfully!");
      } else {
        // Add new land
        await landsService.createLand(apiDataWithoutLocation);
        toast.success("Success", "Land record added successfully!");
      }

      // Refresh the lands list
      await fetchLands();
      setModalOpen(false);
      setEditingLand(null);
    } catch (error) {
      console.error("Failed to save land:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to save land record";
      toast.error("Error", errorMessage);
      throw error; // Re-throw so modal can catch it
    }
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setLocationFilter("");
    setTypeFilter("");
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <DashboardHeader />

      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Fade in timeout={600}>
          <Box>
            <LandsFilters
              locationFilter={locationFilter}
              typeFilter={typeFilter}
              searchValue={searchTerm}
              onLocationFilterChange={setLocationFilter}
              onTypeFilterChange={setTypeFilter}
              onSearchChange={setSearchTerm}
              onAddLand={handleAddLand}
              onClearFilters={handleClearFilters}
            />

            <Box sx={{ mt: 3 }}>
              <LandsTable
                lands={paginatedLands}
                onEditLand={handleEditLand}
                page={page}
                rowsPerPage={rowsPerPage}
                totalCount={totalCount}
                onPageChange={setPage}
                onRowsPerPageChange={setRowsPerPage}
                loading={loading}
              />
            </Box>

            <AddEditLandModal
              open={modalOpen}
              onClose={() => {
                setModalOpen(false);
                setEditingLand(null);
              }}
              onSave={handleSaveLand}
              land={editingLand}
            />
          </Box>
        </Fade>
      </Container>
    </Box>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}
