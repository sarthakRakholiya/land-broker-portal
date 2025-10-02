"use client";

import React from "react";
import {
  Box,
  TextField,
  Chip,
  Typography,
  Paper,
  MenuItem,
  IconButton,
  Collapse,
  useMediaQuery,
  useTheme,
  Button,
  InputAdornment,
} from "@mui/material";
import {
  FilterList as FilterIcon,
  Clear as ClearIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Search as SearchIcon,
  Add as AddIcon,
} from "@mui/icons-material";
// Remove LAND_TYPES import as we'll use localized types
import { useLanguage } from "@/contexts/LanguageContext";
import { locationsService } from "@/services/locations";
import { useState, useEffect } from "react";

interface LandsFiltersProps {
  locationFilter: string;
  typeFilter: string;
  searchValue: string;
  onLocationFilterChange: (location: string) => void;
  onTypeFilterChange: (type: string) => void;
  onSearchChange: (search: string) => void;
  onAddLand: () => void;
  onClearFilters: () => void;
}

export function LandsFilters({
  locationFilter,
  typeFilter,
  searchValue,
  onLocationFilterChange,
  onTypeFilterChange,
  onSearchChange,
  onAddLand,
  onClearFilters,
}: LandsFiltersProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [expanded, setExpanded] = React.useState(!isMobile);
  const { t } = useLanguage();
  const [allLocations, setAllLocations] = useState<string[]>([]);
  const [loadingLocations, setLoadingLocations] = useState(false);

  // Create localized land type options
  const localizedLandTypes = [
    { value: "land", label: t("landTypes.land") },
    { value: "house", label: t("landTypes.house") },
    { value: "apartment", label: t("landTypes.apartment") },
    { value: "commercial", label: t("landTypes.commercial") },
    { value: "industrial", label: t("landTypes.industrial") },
    { value: "agricultural", label: t("landTypes.agricultural") },
  ];

  const activeFiltersCount = [locationFilter, typeFilter].filter(
    Boolean
  ).length;
  const hasActiveFilters = activeFiltersCount > 0;

  // Fetch all locations from API
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        setLoadingLocations(true);
        const locations = await locationsService.getLocations();
        const locationNames = locations.map((location) => location.name);
        setAllLocations(locationNames.sort());
      } catch {
        // Handle fetch error silently
      } finally {
        setLoadingLocations(false);
      }
    };

    fetchLocations();
  }, []);

  return (
    <Paper elevation={1} sx={{ p: { xs: 2, sm: 3 }, mb: 3 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: expanded ? 2 : 0,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <FilterIcon sx={{ color: "text.secondary" }} />
          <Typography variant="h6" fontWeight={600}>
            {t("common.filter")}
          </Typography>
          {hasActiveFilters && (
            <Chip
              label={`${activeFiltersCount} active`}
              size="small"
              color="primary"
              variant="outlined"
            />
          )}
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {hasActiveFilters && (
            <IconButton onClick={onClearFilters} size="small" color="error">
              <ClearIcon fontSize="small" />
            </IconButton>
          )}
          {isMobile && (
            <IconButton onClick={() => setExpanded(!expanded)} size="small">
              {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          )}
        </Box>
      </Box>

      <Collapse in={expanded}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {/* Main Row: Search + Filters on left, Add Button on right with space between */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", lg: "row" },
              gap: 2,
              alignItems: { xs: "stretch", lg: "center" },
              justifyContent: "space-between",
            }}
          >
            {/* Left Side: Search + Filters */}
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                gap: 2,
                alignItems: { xs: "stretch", sm: "center" },
                flexWrap: "wrap",
                flex: 1,
              }}
            >
              {/* Search Field */}
              <Box sx={{ flex: 1, maxWidth: { xs: "100%", sm: 400 } }}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder={t("land.searchPlaceholder")}
                  value={searchValue}
                  onChange={(e) => onSearchChange(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon
                          sx={{ color: "text.secondary", fontSize: 20 }}
                        />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      bgcolor: "grey.50",
                      "&:hover": {
                        bgcolor: "background.paper",
                      },
                      "&.Mui-focused": {
                        bgcolor: "background.paper",
                      },
                    },
                  }}
                />
              </Box>

              {/* Location Filter */}
              <TextField
                select
                label={t("land.filterByLocation")}
                value={locationFilter}
                onChange={(e) => onLocationFilterChange(e.target.value)}
                sx={{ minWidth: { xs: "100%", sm: 160 } }}
                size="small"
                disabled={loadingLocations}
              >
                <MenuItem value="">{t("land.allLocations")}</MenuItem>
                {loadingLocations ? (
                  <MenuItem disabled>{t("common.loading")}...</MenuItem>
                ) : (
                  allLocations.map((location) => (
                    <MenuItem key={location} value={location}>
                      {location}
                    </MenuItem>
                  ))
                )}
              </TextField>

              {/* Type Filter */}
              <TextField
                select
                label={t("land.filterByType")}
                value={typeFilter}
                onChange={(e) => onTypeFilterChange(e.target.value)}
                sx={{ minWidth: { xs: "100%", sm: 140 } }}
                size="small"
              >
                <MenuItem value="">{t("land.allTypes")}</MenuItem>
                {localizedLandTypes.map((type) => (
                  <MenuItem key={type.value} value={type.value}>
                    {type.label}
                  </MenuItem>
                ))}
              </TextField>
            </Box>

            {/* Right Side: Add Button */}
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={onAddLand}
              sx={{
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 500,
                minWidth: { xs: "100%", lg: "auto" },
                px: 3,
                whiteSpace: "nowrap",
                alignSelf: { xs: "stretch", lg: "center" },
                ml: { lg: 2 },
              }}
            >
              {t("dashboard.addLand")}
            </Button>
          </Box>

          {/* Active Filters Display */}
          {hasActiveFilters && (
            <Box
              sx={{
                display: "flex",
                gap: 1,
                flexWrap: "wrap",
                alignItems: "center",
              }}
            >
              {locationFilter && (
                <Chip
                  label={`Location: ${locationFilter}`}
                  onDelete={() => onLocationFilterChange("")}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              )}
              {typeFilter && (
                <Chip
                  label={`Type: ${
                    localizedLandTypes.find((t) => t.value === typeFilter)
                      ?.label
                  }`}
                  onDelete={() => onTypeFilterChange("")}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              )}
            </Box>
          )}
        </Box>
      </Collapse>
    </Paper>
  );
}
