"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Box, Container, Fade } from "@mui/material";
import { ProtectedRoute } from "@/components/common/ProtectedRoute";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { LandsTable } from "@/components/dashboard/LandsTable";
import { LandsFilters } from "@/components/dashboard/LandsFilters";
import { AddEditLandModal } from "@/components/dashboard/AddEditLandModal";
import { LandRecord } from "@/constants/lands";
import { landsService, LandCreateData, LandUpdateData } from "@/services/lands";
import { toast } from "@/utils/toast";

interface DashboardClientProps {
  initialData: {
    lands: LandRecord[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
}

export function DashboardClient({ initialData }: DashboardClientProps) {
  const [lands, setLands] = useState<LandRecord[]>(initialData.lands);
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [page, setPage] = useState(initialData.pagination.page);
  const [rowsPerPage, setRowsPerPage] = useState(initialData.pagination.limit);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingLand, setEditingLand] = useState<LandRecord | null>(null);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(initialData.pagination.total);

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
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch lands";
      toast.error("Error", errorMessage);
      // Set empty state on error
      setLands([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, searchTerm, locationFilter, typeFilter]);

  // Fetch lands when filters change
  useEffect(() => {
    fetchLands();
  }, [fetchLands]);

  // Reset page when filters change
  useEffect(() => {
    setPage(0);
  }, [searchTerm, locationFilter, typeFilter]);

  const handleAddLand = () => {
    setEditingLand(null);
    setModalOpen(true);
  };

  const handleEditLand = (land: LandRecord) => {
    setEditingLand(land);
    setModalOpen(true);
  };

  const handleSaveLand = async (landData: Partial<LandRecord>) => {
    try {
      if (editingLand) {
        // Update existing land
        const updateData: LandUpdateData = {
          id: editingLand.id,
          fullName: landData.fullName || editingLand.fullName,
          mobileNo: landData.mobileNo || editingLand.mobileNo,
          locationId: landData.location?.id || editingLand.location.id,
          landArea: landData.landArea || editingLand.landArea,
          landAreaUnit: landData.landAreaUnit || editingLand.landAreaUnit,
          type: landData.type || editingLand.type,
          totalPrice: landData.totalPrice || editingLand.totalPrice,
        };
        await landsService.updateLand(updateData);
        toast.success("Success", "Land updated successfully!");
      } else {
        // Create new land
        const createData: LandCreateData = {
          fullName: landData.fullName || "",
          mobileNo: landData.mobileNo || "",
          locationId: landData.location?.id || "",
          landArea: landData.landArea || 0,
          landAreaUnit: landData.landAreaUnit || "bigha",
          type: landData.type || "land",
          totalPrice: landData.totalPrice || 0,
        };
        await landsService.createLand(createData);
        toast.success("Success", "Land created successfully!");
      }
      setModalOpen(false);
      setEditingLand(null);
      // Refresh the lands list
      fetchLands();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to save land record";
      toast.error("Error", errorMessage);
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingLand(null);
  };

  return (
    <ProtectedRoute>
      <Box sx={{ flexGrow: 1, minHeight: "100vh", bgcolor: "grey.50" }}>
        <Container maxWidth="xl" sx={{ py: 3 }}>
          <Fade in timeout={300}>
            <Box>
              <DashboardHeader />

              <LandsFilters
                searchValue={searchTerm}
                onSearchChange={setSearchTerm}
                locationFilter={locationFilter}
                onLocationFilterChange={setLocationFilter}
                typeFilter={typeFilter}
                onTypeFilterChange={setTypeFilter}
                onAddLand={handleAddLand}
                onClearFilters={() => {
                  setSearchTerm("");
                  setLocationFilter("");
                  setTypeFilter("");
                }}
              />

              <LandsTable
                lands={lands}
                loading={loading}
                page={page}
                rowsPerPage={rowsPerPage}
                totalCount={totalCount}
                onPageChange={setPage}
                onRowsPerPageChange={setRowsPerPage}
                onEditLand={handleEditLand}
              />

              <AddEditLandModal
                open={modalOpen}
                onClose={handleCloseModal}
                onSave={handleSaveLand}
                land={editingLand}
              />
            </Box>
          </Fade>
        </Container>
      </Box>
    </ProtectedRoute>
  );
}
