"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type Language = "en" | "gu";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

// Translation function - in a real app, this would be more sophisticated
const translations: Record<Language, Record<string, string>> = {
  en: {
    // Common
    "common.loading": "Loading...",
    "common.save": "Save",
    "common.saving": "Saving...",
    "common.cancel": "Cancel",
    "common.edit": "Edit",
    "common.update": "Update",
    "common.delete": "Delete",
    "common.add": "Add",
    "common.search": "Search",
    "common.filter": "Filter",
    "common.clear": "Clear",
    "common.close": "Close",
    "common.submit": "Submit",
    "common.back": "Back",
    "common.next": "Next",
    "common.previous": "Previous",
    "common.logout": "Logout",
    "common.profile": "Profile",
    "common.settings": "Settings",

    // Auth
    "auth.login": "Login",
    "auth.email": "Email",
    "auth.password": "Password",
    "auth.loginSuccess": "Login successful",
    "auth.loginError": "Login failed",
    "auth.logoutSuccess": "Logged out successfully",

    // Dashboard
    "dashboard.title": "Dashboard",
    "dashboard.welcome": "Welcome to DB Vekariya",
    "dashboard.subtitle": "Manage your land properties and client information",
    "dashboard.addLand": "Add Land",
    "dashboard.noLandsFound": "No lands found",
    "dashboard.noLandsDescription":
      "There are currently no land records to display.",
    "dashboard.noLandsAction":
      'Click the "Add Land" button to create your first land record.',

    // Land
    "land.fullName": "Full Name",
    "land.mobileNo": "Mobile Number",
    "land.location": "Location",
    "land.landArea": "Land Area",
    "land.landAreaUnit": "Area Unit",
    "land.unit": "Unit",
    "land.type": "Land Type",
    "land.totalPrice": "Total Price",
    "land.pricePerArea": "Price per Area",
    "land.action": "Action",
    "land.ownerInfo": "Owner Information",
    "land.landInfo": "Land Information",
    "land.addLand": "Add Land",
    "land.editLand": "Edit Land",
    "land.createLocation": "Create",
    "land.createLandType": "Create",
    "land.searchPlaceholder": "Search lands, locations, owners...",
    "land.filterByLocation": "Filter by Location",
    "land.filterByType": "Filter by Type",
    "land.allLocations": "All Locations",
    "land.allTypes": "All Types",
    "land.editLandRecord": "Edit Land Record",

    // Land Types
    "landTypes.land": "Land",
    "landTypes.house": "House",
    "landTypes.apartment": "Apartment",
    "landTypes.commercial": "Commercial",
    "landTypes.industrial": "Industrial",
    "landTypes.agricultural": "Agricultural",

    // Area Units
    "areaUnits.sqft": "Square Feet",
    "areaUnits.acres": "Acres",
    "areaUnits.bigha": "Bigha",
    "areaUnits.hectare": "Hectare",

    // Language
    "language.changeLanguage": "Change Language",
    "language.gujarati": "ગુજરાતી",
    "language.english": "English",
  },
  gu: {
    // Common
    "common.loading": "લોડ થઈ રહ્યું છે...",
    "common.save": "સેવ કરો",
    "common.saving": "સેવ થઈ રહ્યું છે...",
    "common.cancel": "રદ કરો",
    "common.edit": "સંપાદન કરો",
    "common.update": "અપડેટ કરો",
    "common.delete": "ડિલીટ કરો",
    "common.add": "ઉમેરો",
    "common.search": "શોધો",
    "common.filter": "ફિલ્ટર",
    "common.clear": "સાફ કરો",
    "common.close": "બંધ કરો",
    "common.submit": "સબમિટ કરો",
    "common.back": "પાછળ",
    "common.next": "આગળ",
    "common.previous": "પાછલું",
    "common.logout": "લોગઆઉટ",
    "common.profile": "પ્રોફાઇલ",
    "common.settings": "સેટિંગ્સ",

    // Auth
    "auth.login": "લોગિન",
    "auth.email": "ઇમેઇલ",
    "auth.password": "પાસવર્ડ",
    "auth.loginSuccess": "લોગિન સફળ",
    "auth.loginError": "લોગિન નિષ્ફળ",
    "auth.logoutSuccess": "સફળતાપૂર્વક લોગઆઉટ",

    // Dashboard
    "dashboard.title": "ડેશબોર્ડ",
    "dashboard.welcome": "DB વેકરિયામાં આપનું સ્વાગત છે",
    "dashboard.subtitle":
      "તમારી જમીનની મિલકતો અને ક્લાયન્ટ માહિતીનું સંચાલન કરો",
    "dashboard.addLand": "જમીન ઉમેરો",
    "dashboard.noLandsFound": "કોઈ જમીન મળી નથી",
    "dashboard.noLandsDescription":
      "દર્શાવવા માટે કોઈ જમીન રેકોર્ડ્સ ઉપલબ્ધ નથી.",
    "dashboard.noLandsAction":
      "તમારો પહેલો જમીન રેકોર્ડ બનાવવા માટે 'જમીન ઉમેરો' બટન પર ક્લિક કરો.",

    // Land
    "land.fullName": "પૂર્ણ નામ",
    "land.mobileNo": "મોબાઇલ નંબર",
    "land.location": "સ્થાન",
    "land.landArea": "જમીનનું ક્ષેત્રફળ",
    "land.landAreaUnit": "ક્ષેત્રફળ એકમ",
    "land.unit": "એકમ",
    "land.type": "જમીનનો પ્રકાર",
    "land.totalPrice": "કુલ કિંમત",
    "land.pricePerArea": "પ્રતિ ક્ષેત્રફળ કિંમત",
    "land.action": "ક્રિયા",
    "land.ownerInfo": "માલિકની માહિતી",
    "land.landInfo": "જમીનની માહિતી",
    "land.addLand": "જમીન ઉમેરો",
    "land.editLand": "જમીન સંપાદન કરો",
    "land.createLocation": "બનાવો",
    "land.createLandType": "બનાવો",
    "land.searchPlaceholder": "જમીન, સ્થાન, માલિકો શોધો...",
    "land.filterByLocation": "સ્થાન દ્વારા ફિલ્ટર કરો",
    "land.filterByType": "પ્રકાર દ્વારા ફિલ્ટર કરો",
    "land.allLocations": "બધા સ્થાનો",
    "land.allTypes": "બધા પ્રકારો",
    "land.editLandRecord": "જમીન રેકોર્ડ સંપાદન કરો",

    // Land Types
    "landTypes.land": "જમીન",
    "landTypes.house": "ઘર",
    "landTypes.apartment": "એપાર્ટમેન્ટ",
    "landTypes.commercial": "વ્યાપારિક",
    "landTypes.industrial": "ઉદ્યોગિક",
    "landTypes.agricultural": "કૃષિ",

    // Area Units
    "areaUnits.sqft": "ચોરસ ફૂટ",
    "areaUnits.acres": "એકર",
    "areaUnits.bigha": "બીઘા",
    "areaUnits.hectare": "હેક્ટર",

    // Language
    "language.changeLanguage": "ભાષા બદલો",
    "language.gujarati": "ગુજરાતી",
    "language.english": "English",
  },
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("gu"); // Default to Gujarati

  useEffect(() => {
    // Load language from localStorage on mount (client-side only)
    if (typeof window !== "undefined") {
      const savedLanguage = localStorage.getItem("language") as Language;
      // Only set to English if explicitly saved as English, otherwise default to Gujarati
      if (savedLanguage === "en") {
        setLanguageState("en");
      }
      // Default to Gujarati for any other case (including null, "gu", or invalid values)
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== "undefined") {
      localStorage.setItem("language", lang);
    }
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
