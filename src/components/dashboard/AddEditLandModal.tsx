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
import { LandRecord } from "@/constants/lands";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "@/utils/toast";
import { useLocations } from "./LocationProvider";
import { Location } from "@/lib/data";

const landSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  mobileNo: z.string().regex(/^[6-9]\d{9}$/, "Invalid mobile number"),
  locationId: z.string().min(1, "Location is required"),
  landArea: z.union([z.string(), z.number()]).transform((val) => {
    const num = typeof val === "string" ? parseFloat(val) : val;
    if (isNaN(num) || num <= 0) {
      throw new Error("Land area must be a valid number greater than 0");
    }
    return num;
  }),
  landAreaUnit: z.enum(["sqft", "acres", "bigha", "hectare"]),
  type: z.enum([
    "land",
    "house",
    "apartment",
    "commercial",
    "industrial",
    "agricultural",
  ]),
  totalPrice: z.union([z.string(), z.number()]).transform((val) => {
    const num = typeof val === "string" ? parseFloat(val) : val;
    if (isNaN(num) || num <= 0) {
      throw new Error("Total price must be a valid number greater than 0");
    }
    return num;
  }),
});

type LandFormData = {
  fullName: string;
  mobileNo: string;
  locationId: string;
  landArea: string | number;
  landAreaUnit: "sqft" | "acres" | "bigha" | "hectare";
  type:
    | "land"
    | "house"
    | "apartment"
    | "commercial"
    | "industrial"
    | "agricultural";
  totalPrice: string | number;
};

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
  const {
    locations,
    loading: loadingLocations,
    searchLocations,
    createLocation,
  } = useLocations();
  const [locationInput, setLocationInput] = useState("");
  const [, setTypeInput] = useState("");
  const [customLandTypes, setCustomLandTypes] = useState<
    { value: string; label: string }[]
  >([]);

  const isEdit = Boolean(land);

  // Create localized land type options
  const localizedLandTypes = [
    { value: "land", label: t("landTypes.land") },
    { value: "house", label: t("landTypes.house") },
    { value: "apartment", label: t("landTypes.apartment") },
    { value: "commercial", label: t("landTypes.commercial") },
    { value: "industrial", label: t("landTypes.industrial") },
    { value: "agricultural", label: t("landTypes.agricultural") },
  ];

  const allLandTypes = [...localizedLandTypes, ...customLandTypes];

  const {
    control,
    handleSubmit,
    reset,
    // watch,
    setValue,
    formState: { errors },
  } = useForm<LandFormData>({
    resolver: zodResolver(landSchema),
    defaultValues: {
      fullName: "",
      mobileNo: "",
      locationId: "",
      landArea: 0,
      landAreaUnit: "bigha",
      type: "land",
      totalPrice: 0,
    },
  });

  // Watch form values for price calculation
  const totalPrice = useWatch({ control, name: "totalPrice" });
  const landArea = useWatch({ control, name: "landArea" });

  // Create localized area unit options
  const localizedAreaUnits = [
    { value: "sqft", label: t("areaUnits.sqft") },
    { value: "acres", label: t("areaUnits.acres") },
    { value: "bigha", label: t("areaUnits.bigha") },
    { value: "hectare", label: t("areaUnits.hectare") },
  ];

  // Locations are provided by LocationProvider

  // Reset form when editing land changes
  useEffect(() => {
    if (land) {
      reset({
        fullName: land.fullName,
        mobileNo: land.mobileNo,
        locationId: land.location.id,
        landArea: land.landArea,
        landAreaUnit: land.landAreaUnit.toLowerCase() as
          | "sqft"
          | "acres"
          | "bigha"
          | "hectare",
        type: land.type.toLowerCase() as
          | "land"
          | "house"
          | "apartment"
          | "commercial"
          | "industrial"
          | "agricultural",
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

  const handleLocationChange = async (value: string) => {
    setLocationInput(value);
    await searchLocations(value);
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
        } as Location & { isCreateOption: true },
      ];
    }

    return locations;
  };

  const handleCreateLocation = async () => {
    if (!locationInput.trim()) return;

    try {
      setIsLoading(true);
      const newLocation = await createLocation(locationInput.trim());

      if (!newLocation) {
        toast.error("Error", "Failed to create location");
        return;
      }
      setValue("locationId", newLocation.id);
      toast.success("Success", "Location created successfully!");
    } catch (error) {
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
        landArea:
          typeof data.landArea === "string"
            ? parseFloat(data.landArea)
            : data.landArea,
        totalPrice:
          typeof data.totalPrice === "string"
            ? parseFloat(data.totalPrice)
            : data.totalPrice,
        location: {
          id: data.locationId,
          name:
            locations.find((l) => l.id === data.locationId)?.name ||
            locationInput,
        },
      };
      await onSave(landData);
    } catch {
      // Handle save error
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
                        if (
                          "isCreateOption" in newValue &&
                          newValue.isCreateOption
                        ) {
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
                            {"isCreateOption" in option &&
                            option.isCreateOption ? (
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
                            Create &quot;{locationInput}&quot;
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
                    value={field.value || ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      field.onChange(value === "" ? "" : value);
                    }}
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
                    options={localizedAreaUnits}
                    getOptionLabel={(option) => option.label}
                    value={
                      localizedAreaUnits.find(
                        (unit) => unit.value === field.value
                      ) || localizedAreaUnits[0]
                    }
                    onChange={(_, newValue) => {
                      field.onChange(
                        newValue?.value || localizedAreaUnits[0].value
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
                  getOptionLabel={(option) =>
                    typeof option === "string" ? option : option.label
                  }
                  value={
                    allLandTypes.find((type) => type.value === field.value) ||
                    allLandTypes[0]
                  }
                  onChange={(_, newValue) => {
                    const value =
                      typeof newValue === "string" ? newValue : newValue?.value;
                    field.onChange(value || allLandTypes[0].value);
                    setTypeInput(value || "");
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
                  value={field.value || ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    field.onChange(value === "" ? "" : value);
                  }}
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
                totalPrice &&
                landArea &&
                (typeof landArea === "number"
                  ? landArea
                  : parseFloat(landArea)) > 0
                  ? (
                      (typeof totalPrice === "number"
                        ? totalPrice
                        : parseFloat(totalPrice)) /
                      (typeof landArea === "number"
                        ? landArea
                        : parseFloat(landArea))
                    ).toFixed(2)
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
