import MainLayout from "../../layouts/MainLayout";
import StationCard from "../../components/stations/StationCard";

export default function DashboardPage() {
  return (
    <MainLayout>
      <h1
        style={{
          marginBottom: "8px",
        }}
      >
        Station Dashboard
      </h1>

      <p
        style={{
          color: "#6b7280",
          marginBottom: "24px",
        }}
      >
        Monitor and manage all gaming stations
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fill, minmax(320px, 1fr))",
          gap: "24px",
        }}
      >
        <StationCard code="PS4-1" type="PS4" />
        <StationCard code="PS4-2" type="PS4" />
        <StationCard code="PS4-3" type="PS4" />
        <StationCard code="PS4-4" type="PS4" />
        <StationCard code="PS4-5" type="PS4" />
        <StationCard code="PS4-6" type="PS4" />
        <StationCard code="PS3-1" type="PS3" />
      </div>
    </MainLayout>
  );
}