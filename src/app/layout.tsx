import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { RouteLoader } from "@/components/common/RouteLoader";
import { AuthProvider } from "@/hooks/useAuth";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { Toast } from "@/components/common/Toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DB Vekariya - Land Broker Portal",
  description:
    "Professional land broker services and property management platform",
  keywords: "land broker, property management, real estate, DB Vekariya",
  authors: [{ name: "DB Vekariya" }],
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>
          <LanguageProvider>
            <AuthProvider>
              {children}
              <RouteLoader />
              <Toast />
            </AuthProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
