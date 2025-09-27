"use client";

import React, { useEffect, useState } from "react";
import { Snackbar, Alert, Slide, SlideProps } from "@mui/material";
import { toast, Toast as ToastType } from "@/utils/toast";

function SlideTransition(props: SlideProps) {
  return <Slide {...props} direction="up" />;
}

export function Toast() {
  const [toasts, setToasts] = useState<ToastType[]>([]);

  useEffect(() => {
    const unsubscribe = toast.subscribe(setToasts);
    return unsubscribe;
  }, []);

  const handleClose = (id: string) => {
    toast.remove(id);
  };

  return (
    <>
      {toasts.map((toastItem) => (
        <Snackbar
          key={toastItem.id}
          open={true}
          autoHideDuration={toastItem.duration}
          onClose={() => handleClose(toastItem.id)}
          TransitionComponent={SlideTransition}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          sx={{ mb: 1 }}
        >
          <Alert
            onClose={() => handleClose(toastItem.id)}
            severity={toastItem.type}
            variant="filled"
            sx={{ width: "100%" }}
          >
            <strong>{toastItem.title}</strong>
            {toastItem.message && (
              <>
                <br />
                {toastItem.message}
              </>
            )}
          </Alert>
        </Snackbar>
      ))}
    </>
  );
}

