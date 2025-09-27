"use client";

import { useServiceWorker } from "@/hooks/useServiceWorker";
import { PWAInstaller } from "./PWAInstaller";

export function PWAWrapper() {
  useServiceWorker();

  return <PWAInstaller />;
}
