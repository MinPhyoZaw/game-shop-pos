import { Box, Typography, Card, CardContent, Button } from "@mui/material";
import { useSessions } from "../../context/SessionContext";
import { useEffect, useState } from "react";

function Duration({ start }: { start: number }) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const diff = now - start;
  const sec = Math.floor(diff / 1000) % 60;
  const min = Math.floor(diff / 60000) % 60;
  const hr = Math.floor(diff / 3600000);

  return (
    <span>
      {hr.toString().padStart(2, "0")}:{min.toString().padStart(2, "0")}:{sec
        .toString()
        .padStart(2, "0")}
    </span>
  );
}

export default function SessionPage() {
  const { sessions, removeSession } = useSessions();

  return (
    <div>
      <h1 className="page-title">Active Sessions</h1>
      <p className="page-subtitle">View all active sessions</p>

      <Box sx={{ display: "grid", gap: 2 }}>
        {sessions.length === 0 && (
          <div className="empty-state">No active sessions</div>
        )}

        {sessions.map((s) => (
          <Card key={s.id} sx={{ borderRadius: 2 }}>
            <CardContent sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2, flexWrap: "wrap" }}>
              <div>
                <Typography variant="h6">{s.stationCode}</Typography>
                <Typography color="text.secondary">{s.game}</Typography>
              </div>

              <div style={{ textAlign: "right" }}>
                <Typography variant="subtitle2">Started</Typography>
                <Typography color="text.secondary">
                  {new Date(s.startTime).toLocaleString()}
                </Typography>
                <Typography variant="subtitle2" sx={{ mt: 1 }}>
                  Duration
                </Typography>
                <Typography>
                  <Duration start={s.startTime} />
                </Typography>
              </div>

              <Box sx={{ ml: 2 }}>
                <Button color="error" onClick={() => removeSession(s.id)}>
                  Stop
                </Button>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
    </div>
  );
}
