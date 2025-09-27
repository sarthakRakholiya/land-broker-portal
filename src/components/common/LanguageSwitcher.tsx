"use client";

import React, { useState } from "react";
import {
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import {
  Language as LanguageIcon,
  Check as CheckIcon,
} from "@mui/icons-material";
import { useLanguage } from "@/contexts/LanguageContext";

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLanguageChange = (lang: "en" | "gu") => {
    setLanguage(lang);
    handleMenuClose();
  };

  const getCurrentLanguageLabel = () => {
    return language === "gu" ? "ગુજરાતી" : "English";
  };

  return (
    <>
      <IconButton
        onClick={handleMenuOpen}
        sx={{
          color: "text.primary",
          display: "flex",
          alignItems: "center",
          gap: 0.5,
          px: 1,
          py: 0.5,
          borderRadius: 1,
          "&:hover": {
            bgcolor: "action.hover",
          },
        }}
      >
        <LanguageIcon sx={{ fontSize: 20 }} />
        <Typography
          variant="body2"
          sx={{ fontSize: "0.75rem", fontWeight: 500 }}
        >
          {getCurrentLanguageLabel()}
        </Typography>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        PaperProps={{
          sx: {
            minWidth: 160,
            mt: 1,
          },
        }}
      >
        <MenuItem
          onClick={() => handleLanguageChange("gu")}
          selected={language === "gu"}
        >
          <ListItemIcon>
            {language === "gu" && <CheckIcon sx={{ fontSize: 16 }} />}
          </ListItemIcon>
          <ListItemText
            primary="ગુજરાતી"
            sx={{
              "& .MuiListItemText-primary": {
                fontSize: "0.875rem",
                fontWeight: language === "gu" ? 600 : 400,
              },
            }}
          />
        </MenuItem>

        <MenuItem
          onClick={() => handleLanguageChange("en")}
          selected={language === "en"}
        >
          <ListItemIcon>
            {language === "en" && <CheckIcon sx={{ fontSize: 16 }} />}
          </ListItemIcon>
          <ListItemText
            primary="English"
            sx={{
              "& .MuiListItemText-primary": {
                fontSize: "0.875rem",
                fontWeight: language === "en" ? 600 : 400,
              },
            }}
          />
        </MenuItem>
      </Menu>
    </>
  );
}
