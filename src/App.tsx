import MainLayout from "./layouts/MainLayout";
import DashboardPage from "./pages/dashboard/DashboardPage";
import SessionPage from "./pages/session/SessionPage";
import ProductPage from "./pages/products/ProductPage";
import GamePage from "./pages/games/GamePage";
import { AppProvider, useApp } from "./context/AppContext";
import { SessionProvider } from "./context/SessionContext";

function AppInner() {
  const { page } = useApp();

  return (
    <MainLayout>
      {page === "Dashboard" && <DashboardPage />}
      {page === "Sessions" && <SessionPage />}
      {page === "Products" && <ProductPage />}
      {page === "Games" && <GamePage />}
      {/* {page !== "Dashboard" && page !== "Sessions" && page !== "Products" && (
        <div>{page} (not implemented)</div>
      )} */}
    </MainLayout>
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