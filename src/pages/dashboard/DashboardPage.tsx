import { useState } from "react";

// Rendered inside the app-level MainLayout
import StationCard from "../../components/stations/StationCard";
import StartSessionModal from "../../components/sessions/StartSessionModal";

export default function DashboardPage() {
  const [open, setOpen] = useState(false);
  const [selectedStation, setSelectedStation] = useState<{
    code: string;
    type: string;
  } | null>(null);

  return (
    <>
      <h1 className="page-title">Station Dashboard</h1>

      <p className="page-subtitle">Monitor and manage all gaming stations</p>

      <div className="stations-grid">
        <StationCard
          code="PS4-1"
          type="PS4"
          onStart={() => {
            setSelectedStation({ code: "PS4-1", type: "PS4" });
            setOpen(true);
          }}
        />

        <StationCard
          code="PS4-2"
          type="PS4"
          onStart={() => {
            setSelectedStation({ code: "PS4-2", type: "PS4" });
            setOpen(true);
          }}
        />

        <StationCard
          code="PS4-3"
          type="PS4"
          onStart={() => {
            setSelectedStation({ code: "PS4-3", type: "PS4" });
            setOpen(true);
          }}
        />

        <StationCard
          code="PS4-4"
          type="PS4"
          onStart={() => {
            setSelectedStation({ code: "PS4-4", type: "PS4" });
            setOpen(true);
          }}
        />

        <StationCard
          code="PS4-5"
          type="PS4"
          onStart={() => {
            setSelectedStation({ code: "PS4-5", type: "PS4" });
            setOpen(true);
          }}
        />

        <StationCard
          code="PS4-6"
          type="PS4"
          onStart={() => {
            setSelectedStation({ code: "PS4-6", type: "PS4" });
            setOpen(true);
          }}
        />

        <StationCard
          code="PS3-1"
          type="PS3"
          onStart={() => {
            setSelectedStation({ code: "PS3-1", type: "PS3" });
            setOpen(true);
          }}
        />
      </div>

      <StartSessionModal
        open={open}
        onClose={() => setOpen(false)}
        stationCode={selectedStation?.code}
        stationType={selectedStation?.type}
      />
    </>
  );
}