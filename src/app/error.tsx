"use client";

import { useEffect } from "react";
import { Button, Box, Typography } from "@mui/material";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "50vh",
        padding: 4,
        textAlign: "center",
      }}
    >
      <Typography variant="h4" sx={{ mb: 2, color: "error.main" }}>
        Something went wrong!
      </Typography>
      <Typography variant="body1" sx={{ mb: 3, color: "text.secondary" }}>
        An unexpected error occurred. Please try again.
      </Typography>
      <Button
        variant="contained"
        onClick={reset}
        sx={{
          px: 3,
          py: 1.5,
        }}
      >
        Try again
      </Button>
    </Box>
  );
}
