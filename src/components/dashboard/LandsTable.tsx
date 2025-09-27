"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Typography,
  Box,
  TablePagination,
  useMediaQuery,
  useTheme,
  Card,
  CardContent,
  Stack,
  Divider,
  CircularProgress,
} from "@mui/material";
import {
  Edit as EditIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
} from "@mui/icons-material";
import { LandRecord, LAND_TYPES } from "@/constants/lands";
import { useLanguage } from "@/contexts/LanguageContext";

interface LandsTableProps {
  lands: LandRecord[];
  onEditLand: (land: LandRecord) => void;
  page: number;
  rowsPerPage: number;
  totalCount: number;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rowsPerPage: number) => void;
  loading?: boolean;
}

export function LandsTable({
  lands,
  onEditLand,
  page,
  rowsPerPage,
  totalCount,
  onPageChange,
  onRowsPerPageChange,
  loading = false,
}: LandsTableProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { t } = useLanguage();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getLandTypeLabel = (type: string) => {
    return LAND_TYPES.find((t) => t.value === type)?.label || type;
  };

  const formatArea = (area: number, unit: string) => {
    return `${area.toLocaleString()} ${unit}`;
  };

  if (isMobile) {
    return (
      <Box>
        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              py: 8,
            }}
          >
            <CircularProgress />
          </Box>
        ) : lands.length === 0 ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              py: 8,
              px: 4,
              textAlign: "center",
            }}
          >
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: "50%",
                bgcolor: "grey.100",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 3,
              }}
            >
              <LocationIcon sx={{ fontSize: 40, color: "text.secondary" }} />
            </Box>
            <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
              {t("dashboard.noLandsFound")}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              {t("dashboard.noLandsDescription")}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t("dashboard.noLandsAction")}
            </Typography>
          </Box>
        ) : (
          <Stack spacing={2}>
            {lands.map((land) => (
              <Card key={land.id} elevation={1}>
                <CardContent sx={{ p: 3 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      mb: 2,
                    }}
                  >
                    <Box>
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: 600, mb: 0.5 }}
                      >
                        {land.fullName}
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 0.5,
                          mb: 1,
                        }}
                      >
                        <PhoneIcon
                          sx={{ fontSize: 16, color: "text.secondary" }}
                        />
                        <Typography variant="body2" color="text.secondary">
                          {land.mobileNo}
                        </Typography>
                      </Box>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                      >
                        <LocationIcon
                          sx={{ fontSize: 16, color: "text.secondary" }}
                        />
                        <Typography variant="body2" color="text.secondary">
                          {typeof land.location === "string"
                            ? land.location
                            : land.location.name}
                        </Typography>
                      </Box>
                    </Box>
                    <IconButton
                      onClick={() => onEditLand(land)}
                      size="small"
                      sx={{ color: "primary.main" }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <Stack spacing={1.5}>
                    <Box
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        Type:
                      </Typography>
                      <Chip
                        label={getLandTypeLabel(land.type)}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    </Box>

                    <Box
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        Area:
                      </Typography>
                      <Typography variant="body2" fontWeight={500}>
                        {formatArea(land.landArea, land.landAreaUnit)}
                      </Typography>
                    </Box>

                    <Box
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        Total Price:
                      </Typography>
                      <Typography
                        variant="body2"
                        fontWeight={600}
                        color="primary.main"
                      >
                        {formatCurrency(land.totalPrice)}
                      </Typography>
                    </Box>

                    <Box
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        Price per {land.landAreaUnit}:
                      </Typography>
                      <Typography variant="body2" fontWeight={500}>
                        {formatCurrency(land.pricePerArea)}
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            ))}
          </Stack>
        )}

        {/* Pagination for Mobile */}
        {!loading && lands.length > 0 && (
          <TablePagination
            component="div"
            count={totalCount}
            page={page}
            onPageChange={(_, newPage) => onPageChange(newPage)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(e) =>
              onRowsPerPageChange(parseInt(e.target.value, 10))
            }
            rowsPerPageOptions={[5, 10, 25]}
            sx={{ mt: 2 }}
          />
        )}
      </Box>
    );
  }

  return (
    <Box>
      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            py: 8,
          }}
        >
          <CircularProgress />
        </Box>
      ) : lands.length === 0 ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            py: 8,
            px: 4,
            textAlign: "center",
          }}
        >
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              bgcolor: "grey.100",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mb: 3,
            }}
          >
            <LocationIcon sx={{ fontSize: 40, color: "text.secondary" }} />
          </Box>
          <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
            {t("dashboard.noLandsFound")}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {t("dashboard.noLandsDescription")}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t("dashboard.noLandsAction")}
          </Typography>
        </Box>
      ) : (
        <>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: "grey.50" }}>
                  <TableCell sx={{ fontWeight: 600 }}>ID</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>
                    {t("land.fullName")}
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>
                    {t("land.mobileNo")}
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>
                    {t("land.location")}
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>
                    {t("land.landArea")}
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>
                    {t("land.type")}
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>
                    {t("land.totalPrice")}
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>
                    {t("land.pricePerArea")}
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>
                    {t("land.action")}
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {lands.map((land) => (
                  <TableRow
                    key={land.id}
                    sx={{
                      "&:hover": {
                        bgcolor: "grey.50",
                      },
                    }}
                  >
                    <TableCell>
                      <Typography variant="body2" fontWeight={500}>
                        #{land.id.slice(-6).toUpperCase()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight={500}>
                        {land.fullName}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                      >
                        <PhoneIcon
                          sx={{ fontSize: 16, color: "text.secondary" }}
                        />
                        <Typography variant="body2">{land.mobileNo}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                      >
                        <LocationIcon
                          sx={{ fontSize: 16, color: "text.secondary" }}
                        />
                        <Typography variant="body2">
                          {typeof land.location === "string"
                            ? land.location
                            : land.location.name}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {formatArea(land.landArea, land.landAreaUnit)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={getLandTypeLabel(land.type)}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body2"
                        fontWeight={600}
                        color="primary.main"
                      >
                        {formatCurrency(land.totalPrice)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {formatCurrency(land.pricePerArea)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <IconButton
                        onClick={() => onEditLand(land)}
                        size="small"
                        sx={{ color: "primary.main" }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            count={totalCount}
            page={page}
            onPageChange={(_, newPage) => onPageChange(newPage)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(e) =>
              onRowsPerPageChange(parseInt(e.target.value, 10))
            }
            rowsPerPageOptions={[5, 10, 25]}
            sx={{ mt: 2 }}
          />
        </>
      )}
    </Box>
  );
}
