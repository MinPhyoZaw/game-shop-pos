import MainLayout from "./layouts/MainLayout";
import { ThemeProvider, createTheme } from "@mui/material";
import DashboardPage from "./pages/dashboard/DashboardPage";
import SessionPage from "./pages/session/SessionPage";
import ProductPage from "./pages/products/ProductPage";
import GamePage from "./pages/games/GamePage";
import ReportPage from "./pages/reports/RepotPage";
import SettingPage from "./pages/setting/SettingPage";
import { AppProvider, useApp } from "./context/AppContext";
import { SessionProvider } from "./context/SessionContext";

function AppInner() {
  const { page, darkMode } = useApp();

  const theme = createTheme({
  palette: {
    mode: darkMode ? "dark" : "light",
  },
});

  return (
    <ThemeProvider theme={theme}>

    
    <MainLayout>
      {page === "Dashboard" && <DashboardPage />}
      {page === "Sessions" && <SessionPage />}
      {page === "Products" && <ProductPage />}
      {page === "Games" && <GamePage />}
      {page === "Reports" && <ReportPage />}
      {page === "Settings" && <SettingPage />}
      {/* {page !== "Dashboard" && page !== "Sessions" && page !== "Products" && (
        <div>{page} (not implemented)</div>
      )} */}
      
    </MainLayout>
    </ThemeProvider>
  );
}

function App() {
  return (
    <AppProvider>
      <SessionProvider>
        <AppInner />
      </SessionProvider>
    </AppProvider>
  );
}

export default App;