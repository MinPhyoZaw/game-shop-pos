import { Box, Typography, Alert, IconButton } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { useSessions } from "../../context/SessionContext";
import { useEffect, useState } from "react";
import SessionCard from "./SessionCard";
import CheckoutDialog from "./CheckoutDialog";

export default function SessionPage() {
  const { sessions, removeSession, dismissPreAlert } = useSessions();
  const [checkoutSessionId, setCheckoutSessionId] = useState<string | null>(null);
  const [checkoutDone, setCheckoutDone] = useState(false);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const ended = sessions.find((s) => s.status === "ended");
    if (ended) {
      setCheckoutSessionId(ended.id);
      setCheckoutDone(false);
    }
  }, [sessions]);

  const openCheckout = (id: string) => {
    setCheckoutSessionId(id);
    setCheckoutDone(false);
  };

  const closeCheckout = () => {
    setCheckoutSessionId(null);
    setCheckoutDone(false);
  };

  const performCheckout = () => {
    setCheckoutDone(true);
  };

  const checkoutSession = sessions.find(x => x.id === checkoutSessionId);

  return (
    <div>
      <Typography variant="h4">Active Sessions</Typography>
      <Typography color="text.secondary" sx={{ mb: 2 }}>
        View all active sessions
      </Typography>

      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 2 }}>
        {sessions
          .filter((s) => s.preAlert && !s.alertDismissed)
          .map((s) => (
            <Alert
              key={`prealert-${s.id}`}
              severity="warning"
              action={
                <IconButton size="small" onClick={() => dismissPreAlert(s.id)}>
                  <CloseIcon fontSize="small" />
                </IconButton>
              }
              sx={{ gridColumn: "1 / -1", mb: 1 }}
            >
              {s.stationCode} will be closed in {Math.max(0, Math.ceil((s.endTime! - now) / 1000))} seconds
            </Alert>
          ))}
        {sessions.length === 0 && (
          <Typography color="text.secondary">No active sessions</Typography>
        )}

        {sessions.map((s) => (
          <SessionCard key={s.id} session={s} now={now} onCheckout={openCheckout} />
        ))}

        <CheckoutDialog
          open={!!checkoutSessionId}
          onClose={closeCheckout}
          session={checkoutSession ?? null}
          now={now}
          done={checkoutDone}
          onConfirm={performCheckout}
          onRemove={removeSession}
        />
      </Box>
    </div>
  );
}