"use client";

import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import { AccountCircle, Logout } from "@mui/icons-material";
import { useAuth } from "@/hooks/useAuth";
import { LanguageSwitcher } from "@/components/common/LanguageSwitcher";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "@/utils/toast";

interface DashboardHeaderProps {}

export function DashboardHeader({}: DashboardHeaderProps) {
  const { logout } = useAuth();
  const { t } = useLanguage();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      handleMenuClose();
      await logout();
      toast.success("Success", t("auth.logoutSuccess"));
    } catch (error) {
      console.error("Logout failed:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Logout failed";
      toast.error("Error", errorMessage);
    }
  };

  return (
    <AppBar
      position="sticky"
      elevation={1}
      sx={{
        bgcolor: "background.paper",
        color: "text.primary",
        borderBottom: "1px solid",
        borderBottomColor: "divider",
      }}
    >
      <Toolbar sx={{ gap: 2 }}>
        {/* Logo */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Box
            sx={{
              width: 32,
              height: 32,
              bgcolor: "primary.main",
              borderRadius: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography
              variant="body2"
              sx={{
                color: "primary.contrastText",
                fontWeight: "bold",
                fontSize: "0.875rem",
              }}
            >
              DB
            </Typography>
          </Box>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              display: { xs: "none", sm: "block" },
            }}
          >
            DB Vekariya
          </Typography>
        </Box>

        {/* Spacer to push profile menu to the right */}
        <Box sx={{ flexGrow: 1 }} />

        {/* Language Switcher */}
        <LanguageSwitcher />

        {/* Profile Menu - Right Side */}
        <IconButton
          onClick={handleProfileMenuOpen}
          sx={{ color: "text.primary" }}
        >
          <AccountCircle />
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
        >
          <MenuItem onClick={handleLogout}>
            <Logout sx={{ mr: 1, fontSize: 20 }} />
            {t("common.logout")}
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}
