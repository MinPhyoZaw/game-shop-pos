import React, { createContext, useContext, useEffect, useState } from "react";

export type Page = "Dashboard" | "Sessions" | "Products" | "Games" | "Reports" | "Settings";

export interface ShopSettings {
  shopName: string;
  cashierName: string;
}

const defaultShopSettings: ShopSettings = {
  shopName: "TKFamily Game Zone",
  cashierName: "Zin Min Oo",
};

interface AppContextValue {
  page: Page;
  setPage: (p: Page) => void;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
  shopSettings: ShopSettings;
  saveShopSettings: (settings: ShopSettings) => void;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

const getStoredShopSettings = (): ShopSettings => {
  if (typeof window === "undefined") return defaultShopSettings;

  const stored = window.localStorage.getItem("shopSettings");
  if (!stored) return defaultShopSettings;

  try {
    return {
      ...defaultShopSettings,
      ...JSON.parse(stored),
    };
  } catch {
    return defaultShopSettings;
  }
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [page, setPage] = useState<Page>("Dashboard");
  const [darkMode, setDarkMode] = useState(false);
  const [shopSettings, setShopSettings] = useState<ShopSettings>(getStoredShopSettings);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    if (typeof window === "undefined") return true;
    const stored = window.localStorage.getItem("soundEnabled");
    return stored === null ? true : stored === "true";
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("soundEnabled", soundEnabled ? "true" : "false");
    }
  }, [soundEnabled]);

  const saveShopSettings = (settings: ShopSettings) => {
    setShopSettings(settings);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("shopSettings", JSON.stringify(settings));
    }
  };

  return (
    <AppContext.Provider
      value={{
        page,
        setPage,
        soundEnabled,
        setSoundEnabled,
        darkMode,
        setDarkMode,
        shopSettings,
        saveShopSettings,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
};
