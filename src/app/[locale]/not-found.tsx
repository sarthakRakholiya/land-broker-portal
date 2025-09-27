"use client";

import Link from "next/link";
import { Button, Container, Typography, Box } from "@mui/material";
import {
  Home as HomeIcon,
  ArrowBack as ArrowBackIcon,
} from "@mui/icons-material";
import { useLanguage } from "@/contexts/LanguageContext";

export default function NotFound() {
  const { t } = useLanguage();
  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          textAlign: "center",
          gap: 3,
        }}
      >
        <Typography
          variant="h1"
          component="h1"
          sx={{
            fontSize: { xs: "4rem", sm: "6rem" },
            fontWeight: "bold",
            color: "primary.main",
            lineHeight: 1,
          }}
        >
          404
        </Typography>

        <Typography
          variant="h4"
          component="h2"
          sx={{
            fontWeight: "medium",
            color: "text.primary",
            mb: 1,
          }}
        >
          {t("common.pageNotFound")}
        </Typography>

        <Typography
          variant="body1"
          sx={{
            color: "text.secondary",
            mb: 3,
            maxWidth: "400px",
          }}
        >
          {t("common.pageNotFoundDescription")}
        </Typography>

        <Box
          sx={{
            display: "flex",
            gap: 2,
            flexDirection: { xs: "column", sm: "row" },
            width: "100%",
            maxWidth: "300px",
          }}
        >
          <Button
            component={Link}
            href="/login"
            variant="contained"
            startIcon={<HomeIcon />}
            fullWidth
            sx={{ minHeight: "48px" }}
          >
            {t("common.goToLogin")}
          </Button>

          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => window.history.back()}
            fullWidth
            sx={{ minHeight: "48px" }}
          >
            {t("common.goBack")}
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
