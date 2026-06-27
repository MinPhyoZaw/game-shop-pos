import { useCallback, useEffect, useState } from "react";
import StationCard from "../../components/stations/StationCard";
import StartSessionModal from "../../components/sessions/StartSessionModal";
import type { SessionWithDetails } from "../../context/SessionContext";
import type { Station } from "../../types/station";

export default function DashboardPage() {
  const [open, setOpen] = useState(false);
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const [stations, setStations] = useState<Station[]>([]);
  const [sessions, setSessions] = useState<SessionWithDetails[]>([]);

  const loadSessions = useCallback(async () => {
    const data = await window.api.sessions.getAll();
    setSessions(data);
  }, []);

  useEffect(() => {
    window.api.stations.getAll().then(setStations);
    loadSessions();
    const id = setInterval(loadSessions, 3000);
    return () => clearInterval(id);
  }, [loadSessions]);

  return (
    <>
      <h1 className="page-title">Station Dashboard</h1>

      <p className="page-subtitle">Monitor and manage all gaming stations</p>

      <div className="stations-grid">
        {stations.map((station) => (
          <StationCard
            key={station.id}
            code={station.code}
            type={station.type}
            session={sessions.find((s) => s.station.code === station.code)}
            onRefresh={loadSessions}
            onStart={() => {
              setSelectedStation(station);
              setOpen(true);
            }}
          />
        ))}
      </div>

      <StartSessionModal
        open={open}
        onClose={() => setOpen(false)}
        stationId={selectedStation?.id}
        stationCode={selectedStation?.code}
        stationType={selectedStation?.type}
        hourlyRateMmk={selectedStation?.hourlyRateMmk}
        onStarted={loadSessions}
      />
    </>
  );
}
