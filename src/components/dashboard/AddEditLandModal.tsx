"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  IconButton,
  Typography,
  Autocomplete,
  InputAdornment,
  Chip,
  CircularProgress,
} from "@mui/material";
import {
  Close as CloseIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Straighten as AreaIcon,
  CurrencyRupee as CurrencyIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import { useForm, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { LandRecord, LAND_TYPES, LAND_AREA_UNITS } from "@/constants/lands";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "@/utils/toast";
import { locationsService, Location } from "@/services/locations";

const landSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  mobileNo: z.string().regex(/^[6-9]\d{9}$/, "Invalid mobile number"),
  locationId: z.string().min(1, "Location is required"),
  landArea: z.coerce.number().min(1, "Land area must be greater than 0"),
  landAreaUnit: z.enum(["sqft", "acres", "bigha", "hectare"]),
  type: z.enum([
    "land",
    "house",
    "apartment",
    "commercial",
    "industrial",
    "agricultural",
  ]),
  totalPrice: z.coerce.number().min(1, "Total price must be greater than 0"),
});

type LandFormData = z.infer<typeof landSchema>;

interface AddEditLandModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (
    data: Omit<LandRecord, "id" | "createdAt" | "updatedAt" | "pricePerArea">
  ) => void;
  land?: LandRecord | null;
}

export function AddEditLandModal({
  open,
  onClose,
  onSave,
  land,
}: AddEditLandModalProps) {
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [locations, setLocations] = useState<Location[]>([]);
  const [loadingLocations, setLoadingLocations] = useState(false);
  const [locationInput, setLocationInput] = useState("");
  const [typeInput, setTypeInput] = useState("");
  const [customLandTypes, setCustomLandTypes] = useState<
    { value: string; label: string }[]
  >([]);

  const isEdit = Boolean(land);
  const allLandTypes = [...LAND_TYPES, ...customLandTypes];

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LandFormData>({
    resolver: zodResolver(landSchema),
    defaultValues: {
      fullName: "",
      mobileNo: "",
      locationId: "",
      landArea: 0,
      landAreaUnit: "sqft",
      type: "land",
      totalPrice: 0,
    },
  });

  // Watch form values for price calculation
  const totalPrice = useWatch({ control, name: "totalPrice" });
  const landArea = useWatch({ control, name: "landArea" });

  // Fetch locations when modal opens
  useEffect(() => {
    if (open) {
      fetchLocations();
    }
  }, [open]);

  // Reset form when editing land changes
  useEffect(() => {
    if (land) {
      reset({
        fullName: land.fullName,
        mobileNo: land.mobileNo,
        locationId: land.location.id,
        landArea: land.landArea,
        landAreaUnit: land.landAreaUnit.toLowerCase(),
        type: land.type.toLowerCase(),
        totalPrice: land.totalPrice,
      });
      setLocationInput(land.location.name);
    } else {
      reset({
        fullName: "",
        mobileNo: "",
        locationId: "",
        landArea: 0,
        landAreaUnit: "sqft",
        type: "land",
        totalPrice: 0,
      });
      setLocationInput("");
    }
  }, [land, reset]);

  const fetchLocations = async () => {
    try {
      setLoadingLocations(true);
      const fetchedLocations = await locationsService.getLocations();
      setLocations(fetchedLocations);
    } catch (error) {
      console.error("Failed to fetch locations:", error);
      toast.error("Error", "Failed to fetch locations");
    } finally {
      setLoadingLocations(false);
    }
  };

  const handleLocationChange = async (value: string) => {
    setLocationInput(value);

    if (value.trim()) {
      try {
        const searchResults = await locationsService.getLocations({
          search: value.trim(),
        });
        setLocations(searchResults);
      } catch (error) {
        console.error("Failed to search locations:", error);
      }
    } else {
      await fetchLocations();
    }
  };

  // Create options with "Create new" option when user types something
  const getLocationOptions = () => {
    const hasExactMatch = locations.some(
      (location) => location.name.toLowerCase() === locationInput.toLowerCase()
    );

    if (locationInput.trim() && !hasExactMatch) {
      return [
        ...locations,
        {
          id: "create-new",
          name: `Create "${locationInput}"`,
          isCreateOption: true,
        },
      ];
    }

    return locations;
  };

  const handleCreateLocation = async () => {
    if (!locationInput.trim()) return;

    try {
      setIsLoading(true);
      const newLocation = await locationsService.createLocation({
        name: locationInput.trim(),
      });

      setLocations((prev) => [newLocation, ...prev]);
      setValue("locationId", newLocation.id);
      toast.success("Success", "Location created successfully!");
    } catch (error) {
      console.error("Failed to create location:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to create location";
      toast.error("Error", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTypeChange = (value: string) => {
    setTypeInput(value);

    // Check if it's a new type
    const existingType = allLandTypes.find((type) => type.value === value);
    if (!existingType && value.trim()) {
      const newType = {
        value: value.toLowerCase(),
        label: value.charAt(0).toUpperCase() + value.slice(1).toLowerCase(),
      };

      // Check if it's already in custom types
      const isAlreadyCustom = customLandTypes.find(
        (type) => type.value === newType.value
      );
      if (!isAlreadyCustom) {
        setCustomLandTypes((prev) => [...prev, newType]);
      }
    }
  };

  const onSubmit = async (data: LandFormData) => {
    try {
      setIsSaving(true);
      const landData = {
        ...data,
        location: {
          id: data.locationId,
          name:
            locations.find((l) => l.id === data.locationId)?.name ||
            locationInput,
        },
      };
      await onSave(landData);
    } catch (error) {
      console.error("Error saving land:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    reset();
    setLocationInput("");
    setTypeInput("");
    setCustomLandTypes([]);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: 3,
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          pb: 1,
        }}
      >
        <Typography variant="h6" component="div">
          {isEdit ? t("land.editLand") : t("land.addLand")}
        </Typography>
        <IconButton onClick={handleClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent sx={{ pt: 1 }}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
              gap: 3,
              pb: 2,
            }}
          >
            {/* Full Name */}
            <Controller
              name="fullName"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label={t("land.fullName")}
                  error={!!errors.fullName}
                  helperText={errors.fullName?.message}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                  fullWidth
                  sx={{ gridColumn: { xs: "1", sm: "1 / -1" } }}
                />
              )}
            />

            {/* Mobile Number */}
            <Controller
              name="mobileNo"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label={t("land.mobileNo")}
                  error={!!errors.mobileNo}
                  helperText={errors.mobileNo?.message}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PhoneIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                  fullWidth
                />
              )}
            />

            {/* Location */}
            <Box>
              <Controller
                name="locationId"
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    {...field}
                    options={getLocationOptions()}
                    getOptionLabel={(option) =>
                      typeof option === "string" ? option : option.name
                    }
                    value={locations.find((l) => l.id === field.value) || null}
                    onChange={(_, newValue) => {
                      if (newValue && typeof newValue === "object") {
                        if (newValue.isCreateOption) {
                          handleCreateLocation();
                        } else {
                          field.onChange(newValue.id);
                          setLocationInput(newValue.name);
                        }
                      }
                    }}
                    onInputChange={(_, newInputValue) => {
                      handleLocationChange(newInputValue);
                    }}
                    inputValue={locationInput}
                    loading={loadingLocations}
                    freeSolo
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label={t("land.location")}
                        error={!!errors.locationId}
                        helperText={errors.locationId?.message}
                        InputProps={{
                          ...params.InputProps,
                          startAdornment: (
                            <InputAdornment position="start">
                              <LocationIcon color="action" />
                            </InputAdornment>
                          ),
                          endAdornment: (
                            <>
                              {loadingLocations ? (
                                <CircularProgress color="inherit" size={20} />
                              ) : null}
                              {params.InputProps.endAdornment}
                            </>
                          ),
                        }}
                      />
                    )}
                    renderOption={(props, option) => {
                      const { key, ...otherProps } = props;
                      return (
                        <li key={key} {...otherProps}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            {option.isCreateOption ? (
                              <AddIcon fontSize="small" color="primary" />
                            ) : (
                              <LocationIcon fontSize="small" color="action" />
                            )}
                            {typeof option === "string" ? option : option.name}
                          </Box>
                        </li>
                      );
                    }}
                    noOptionsText={
                      locationInput.trim() ? (
                        <Box sx={{ p: 1 }}>
                          <Button
                            startIcon={<AddIcon />}
                            onClick={handleCreateLocation}
                            disabled={isLoading}
                            size="small"
                            fullWidth
                          >
                            Create "{locationInput}"
                          </Button>
                        </Box>
                      ) : (
                        "No locations found"
                      )
                    }
                  />
                )}
              />
            </Box>

            {/* Land Area and Unit */}
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                gap: 2,
              }}
            >
              <Controller
                name="landArea"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label={t("land.landArea")}
                    type="number"
                    error={!!errors.landArea}
                    helperText={errors.landArea?.message}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <AreaIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      flex: { xs: "none", sm: 1 },
                      width: { xs: "100%", sm: "auto" },
                    }}
                  />
                )}
              />
              <Controller
                name="landAreaUnit"
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    {...field}
                    options={LAND_AREA_UNITS}
                    getOptionLabel={(option) => option.label}
                    value={
                      LAND_AREA_UNITS.find(
                        (unit) => unit.value === field.value
                      ) || LAND_AREA_UNITS[0]
                    }
                    onChange={(_, newValue) => {
                      field.onChange(
                        newValue?.value || LAND_AREA_UNITS[0].value
                      );
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label={t("land.unit")}
                        sx={{
                          minWidth: { xs: "100%", sm: 180 },
                          width: { xs: "100%", sm: "auto" },
                        }}
                      />
                    )}
                  />
                )}
              />
            </Box>

            {/* Land Type */}
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <Autocomplete
                  {...field}
                  options={allLandTypes}
                  getOptionLabel={(option) => option.label}
                  value={
                    allLandTypes.find((type) => type.value === field.value) ||
                    allLandTypes[0]
                  }
                  onChange={(_, newValue) => {
                    field.onChange(newValue?.value || allLandTypes[0].value);
                    setTypeInput(newValue?.value || "");
                  }}
                  onInputChange={(_, newInputValue) => {
                    handleTypeChange(newInputValue);
                  }}
                  freeSolo
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={t("land.type")}
                      error={!!errors.type}
                      helperText={errors.type?.message}
                    />
                  )}
                />
              )}
            />

            {/* Total Price */}
            <Controller
              name="totalPrice"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label={t("land.totalPrice")}
                  type="number"
                  error={!!errors.totalPrice}
                  helperText={errors.totalPrice?.message}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <CurrencyIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                  fullWidth
                />
              )}
            />

            {/* Price Per Area (Calculated) */}
            <TextField
              label={t("land.pricePerArea")}
              type="number"
              value={
                totalPrice && landArea && landArea > 0
                  ? (totalPrice / landArea).toFixed(2)
                  : "0.00"
              }
              InputProps={{
                readOnly: true,
                startAdornment: (
                  <InputAdornment position="start">
                    <CurrencyIcon color="action" />
                  </InputAdornment>
                ),
              }}
              helperText="Calculated automatically"
              fullWidth
            />
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button onClick={handleClose} disabled={isSaving}>
            {t("common.cancel")}
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isSaving || isLoading}
            startIcon={
              isSaving ? <CircularProgress size={20} color="inherit" /> : null
            }
          >
            {isSaving
              ? t("common.saving")
              : isEdit
              ? t("common.update")
              : t("common.add")}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
