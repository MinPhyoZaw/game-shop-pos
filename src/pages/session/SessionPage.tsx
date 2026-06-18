import { Box, Typography, Card, CardContent, Button } from "@mui/material";
import { useSessions } from "../../context/SessionContext";
import { useEffect, useState } from "react";

function Duration({ start }: { start: number }) {
  const [, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, []);

  const diff = Date.now() - start;
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
      <Typography variant="h4">Active Sessions</Typography>
      <Typography color="text.secondary" sx={{ mb: 2 }}>
        View all active sessions
      </Typography>

      <Box sx={{ display: "grid", gap: 12 }}>
        {sessions.length === 0 && (
          <Typography color="text.secondary">No active sessions</Typography>
        )}

        {sessions.map((s) => (
          <Card key={s.id} sx={{ borderRadius: 2 }}>
            <CardContent sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
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
