"use client";

import React, { useState } from "react";
import {
  Box,
  Card,
  TextField,
  Button,
  Typography,
  Container,
  InputAdornment,
  Fade,
  CircularProgress,
} from "@mui/material";
import {
  Person as PersonIcon,
  Lock as LockIcon,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/contexts/LanguageContext";
import { useRouter } from "next/navigation";
import { toast } from "@/utils/toast";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await login({ email, password });
      router.push("/dashboard");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : t("auth.loginError");
      setError(errorMessage);
      toast.error("Error", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container
      maxWidth="xs"
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        py: { xs: 2, sm: 4 },
      }}
    >
      <Fade in timeout={600}>
        <Box sx={{ width: "100%" }}>
          <Card
            elevation={3}
            sx={{
              p: { xs: 3, sm: 4 },
              borderRadius: 3,
              textAlign: "center",
            }}
          >
            {/* Logo */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                mb: 4,
              }}
            >
              <Box
                sx={{
                  width: { xs: 48, sm: 56 },
                  height: { xs: 48, sm: 56 },
                  bgcolor: "primary.main",
                  borderRadius: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mb: 2,
                }}
              >
                <Typography
                  variant="h5"
                  sx={{
                    color: "primary.contrastText",
                    fontWeight: "bold",
                    fontSize: { xs: "1.25rem", sm: "1.5rem" },
                  }}
                >
                  DB
                </Typography>
              </Box>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  fontSize: { xs: "1.5rem", sm: "2rem" },
                  mb: 1,
                }}
              >
                DB Vekariya
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}
              >
                {t("dashboard.subtitle")}
              </Typography>
            </Box>

            {/* Error Message */}
            {error && (
              <Box
                sx={{
                  p: 2,
                  bgcolor: "error.50",
                  borderRadius: 2,
                  mb: 3,
                  border: "1px solid",
                  borderColor: "error.200",
                }}
              >
                <Typography variant="body2" color="error.dark">
                  {error}
                </Typography>
              </Box>
            )}

            {/* Login Form */}
            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label={t("auth.email")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                sx={{ mb: 3 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon
                        sx={{ color: "text.secondary", fontSize: 20 }}
                      />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                fullWidth
                label={t("auth.password")}
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                sx={{ mb: 4 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon
                        sx={{ color: "text.secondary", fontSize: 20 }}
                      />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <Button
                        onClick={() => setShowPassword(!showPassword)}
                        sx={{ minWidth: "auto", p: 1 }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </Button>
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={isLoading}
                sx={{
                  py: 1.5,
                  fontSize: "1rem",
                  fontWeight: 600,
                }}
              >
                {isLoading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  t("auth.login")
                )}
              </Button>
            </Box>
          </Card>
        </Box>
      </Fade>
    </Container>
  );
}
