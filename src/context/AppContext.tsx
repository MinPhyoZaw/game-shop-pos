import React, { createContext, useContext, useEffect, useState } from "react";

export type Page = "Dashboard" | "Sessions" | "Products" | "Games" | "Reports" | "Settings";

interface AppContextValue {
  page: Page;
  setPage: (p: Page) => void;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;

  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [page, setPage] = useState<Page>("Dashboard");
  const [darkMode, setDarkMode] = useState(false);
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

  return (
   <AppContext.Provider
  value={{
    page,
    setPage,

    soundEnabled,
    setSoundEnabled,

    darkMode,
    setDarkMode,
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
