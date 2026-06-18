import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Button,
  Chip,
  Typography,
  Box,
} from "@mui/material";
import { useSessions } from "../../context/SessionContext";

interface Props {
  code: string;
  type: string;
  onStart: () => void;
}

export default function StationCard({ code, type, onStart }: Props) {
  const { sessions, removeSession } = useSessions();
  const session = sessions.find((s) => s.stationCode === code);
  const [, setTick] = useState(0);

  useEffect(() => {
    if (!session) return;
    const id = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, [session]);

  const elapsedMs = session ? Date.now() - session.startTime : 0;
  const seconds = Math.floor(elapsedMs / 1000) % 60;
  const minutes = Math.floor(elapsedMs / 60000) % 60;
  const hours = Math.floor(elapsedMs / 3600000);
  const elapsed = `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

  const ratePerMinute = type === "PS4" ? 50 : type === "PS3" ? Math.round(2000 / 60) : 0;
  const estimatedCost = session ? (Math.ceil(elapsedMs / 60000) * ratePerMinute) : 0;

  return (
    <Card sx={{ borderRadius: 4 }}>
      <CardContent>
        <Typography variant="h5">{code}</Typography>

        <Box sx={{ display: "flex", gap: 1, mt: 1, alignItems: "center" }}>
          <Chip label={type} color={type === "PS4" ? "primary" : "secondary"} />

          <Chip
            label={session ? "Running" : "Idle"}
            color={session ? "warning" : "success"}
            variant={session ? "filled" : "outlined"}
          />
        </Box>

        {session ? (
          <StationCardActions
            session={session}
            elapsed={elapsed}
            estimatedCost={estimatedCost}
            onCloseSession={() => removeSession(session.id)}
          />
        ) : (
          <Button
            variant="contained"
            fullWidth
            sx={{ mt: 4, height: 50, borderRadius: 3 }}
            onClick={onStart}
          >
            Start
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

// Inline small helper component to keep StationCard tidy
import ProductsPane from "../sessions/ProductsPane";

function StationCardActions({
  session,
  elapsed,
  estimatedCost,
  onCloseSession,
}: {
  session: any;
  elapsed: string;
  estimatedCost: number;
  onCloseSession: () => void;
}) {
  const [openPane, setOpenPane] = useState(false);
  return (
    <>
      <Box sx={{ mt: 2 }}>
        <Typography variant="subtitle2">{session.game}</Typography>
        <Typography variant="body2" color="text.secondary">
          Elapsed: {elapsed}
        </Typography>

        <Box sx={{ mt: 1, p: 1, border: "1px solid #e5e7eb", borderRadius: 1 }}>
          <Typography variant="caption" color="text.secondary">
            Estimated Play Cost
          </Typography>
          <Typography>{estimatedCost.toLocaleString()} MMK</Typography>

          <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
            Current Items Total
          </Typography>
          <Typography>{session.itemsTotalMmk.toLocaleString()} MMK</Typography>
        </Box>

        <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
          <Button variant="contained" fullWidth onClick={() => setOpenPane(true)}>
            Add Item
          </Button>

          <Button variant="outlined" fullWidth color="error" onClick={onCloseSession}>
            Close
          </Button>
        </Box>
      </Box>

      <ProductsPane open={openPane} onClose={() => setOpenPane(false)} stationCode={session.stationCode} />
    </>
  );
}