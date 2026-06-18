import MainLayout from "./layouts/MainLayout";
import DashboardPage from "./pages/dashboard/DashboardPage";
import SessionPage from "./pages/session/SessionPage";
import { AppProvider, useApp } from "./context/AppContext";
import { SessionProvider } from "./context/SessionContext";

function AppInner() {
  const { page } = useApp();

  return (
    <MainLayout>
      {page === "Dashboard" && <DashboardPage />}
      {page === "Sessions" && <SessionPage />}
      {page !== "Dashboard" && page !== "Sessions" && (
        <div>{page} (not implemented)</div>
      )}
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