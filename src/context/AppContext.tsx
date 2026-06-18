import React, { createContext, useContext, useState } from "react";

export type Page = "Dashboard" | "Sessions" | "Products" | "Games" | "Reports" | "Settings";

interface AppContextValue {
  page: Page;
  setPage: (p: Page) => void;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [page, setPage] = useState<Page>("Dashboard");

  return (
    <AppContext.Provider value={{ page, setPage }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
};
