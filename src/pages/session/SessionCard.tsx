import { Card, CardContent, Button, Typography, Box } from "@mui/material";
import { keyframes } from "@mui/system";
import { useEffect, useMemo } from "react";
import type { ActiveSession } from "../../context/SessionContext";
import { useSessionCalculations, useDuration } from "./useSessionCalculations";
import { useSessions } from "../../context/SessionContext";

interface Props {
  session: ActiveSession;
  now: number;
  onCheckout: (id: string) => void;
}

export default function SessionCard({ session, now, onCheckout }: Props) {
  const { playCost, totalAmount } = useSessionCalculations(session, now);
  const duration = useDuration(session.startTime, now);

  const { dismissPreAlert } = useSessions();

  const heartbeat = keyframes`
    0% { transform: scale(1); }
    25% { transform: scale(1.06); }
    50% { transform: scale(1); }
    75% { transform: scale(1.06); }
    100% { transform: scale(1); }
  `;

  const remainingMs = useMemo(() => {
    if (!session.durationMinutes) return null;
    const totalMs = session.durationMinutes * 60 * 1000;
    const end = session.endTime ?? (session.startTime + totalMs);
    return end - now;
  }, [session, now]);

  const remainingFormatted = useMemo(() => {
    if (remainingMs === null) return null;
    const ms = Math.max(0, remainingMs);
    const sec = Math.floor(ms / 1000) % 60;
    const min = Math.floor(ms / 60000) % 60;
    const hr = Math.floor(ms / 3600000);
    return `${hr.toString().padStart(2, "0")}:${min.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  }, [remainingMs]);

  const isAlmostOver = remainingMs !== null && remainingMs > 0 && remainingMs <= 5 * 60 * 1000;

  // show a one-time notification when preAlert flag becomes true (5 minutes left)
  useEffect(() => {
    if (session.preAlert && !session.alertDismissed) {
      // Request permission if necessary
      if (typeof Notification !== "undefined") {
        if (Notification.permission === "default") Notification.requestPermission();
        if (Notification.permission === "granted") {
          new Notification("Session ending soon", {
            body: `${session.stationCode} — ${session.game} has 5 minutes remaining.`,
          });
        }
      }

      // mark as dismissed so we don't repeat
      try {
        dismissPreAlert(session.id);
      } catch (e) {
        // ignore
      }
    }
  }, [session.preAlert, session.alertDismissed, session.id, session.stationCode, session.game, dismissPreAlert]);

  return (
    <Card
      sx={{
        borderRadius: 5,
        overflow: "hidden",
        background: "linear-gradient(135deg,#1e293b,#0f172a)",
        color: "#fff",
        transition: "0.25s",
        "&:hover": {
          transform: "translateY(-6px)",
          boxShadow: "0 20px 40px rgba(0,0,0,.25)",
        },
      }}
    >
      <CardContent>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <Typography variant="h5" fontWeight={700}>
            {session.stationCode}
          </Typography>
          <Box
            sx={{
              px: 1.5,
              py: 0.5,
              borderRadius: 99,
              bgcolor: "#22c55e",
              fontSize: 12,
              fontWeight: 600,
            }}
          >
            RUNNING
          </Box>
        </Box>

        <Typography sx={{ color: "#94a3b8", mb: 2 }}>🎮 {session.game}</Typography>

        <Box sx={{ textAlign: "center", py: 2, borderRadius: 3, bgcolor: "rgba(255,255,255,.08)", mb: 2 }}>
          <Typography
            variant="h4"
            fontWeight={700}
            sx={{
              color: isAlmostOver ? "#ff4d4f" : undefined,
              animation: isAlmostOver ? `${heartbeat} 1s infinite` : undefined,
            }}
          >
            {remainingFormatted ?? duration}
          </Typography>
        </Box>

        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, mb: 3 }}>
          <Box>
            <Typography variant="caption" color="#94a3b8">
              Play Cost
            </Typography>
            <Typography fontWeight={700}>{playCost.toLocaleString()} MMK</Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="#94a3b8">
              Items Total
            </Typography>
            <Typography fontWeight={700}>{(session.itemsTotalMmk || 0).toLocaleString()} MMK</Typography>
          </Box>
        </Box>

        {session.items.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="caption" color="#94a3b8" sx={{ mb: 1, display: "block" }}>
              Products
            </Typography>
            {session.items.map((item) => (
              <Box key={item.productId} sx={{ display: "flex", justifyContent: "space-between", py: 0.5 }}>
                <Typography variant="body2" sx={{ color: "#cbd5e1" }}>
                  {item.name} x {item.qty}
                </Typography>
                <Typography variant="body2" sx={{ color: "#cbd5e1" }}>
                  {item.lineTotalMmk.toLocaleString()} MMK
                </Typography>
              </Box>
            ))}
          </Box>
        )}

        <Box sx={{ p: 2, borderRadius: 3, bgcolor: "rgba(255,255,255,.06)", mb: 2 }}>
          <Typography variant="caption" color="#94a3b8">
            Total Amount
          </Typography>
          <Typography variant="h6" fontWeight={700}>
            {totalAmount.toLocaleString()} MMK
          </Typography>
        </Box>

        <Box sx={{ display: "flex", gap: 1 }}>
          <Button fullWidth variant="outlined" color="inherit" onClick={() => onCheckout(session.id)}>
            Close
          </Button>
          <Button fullWidth variant="contained" color="success" onClick={() => onCheckout(session.id)}>
            Checkout
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}