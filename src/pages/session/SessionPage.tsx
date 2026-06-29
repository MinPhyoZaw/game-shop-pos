import { Box, Typography, Alert, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useCallback, useEffect, useState } from "react";
import SessionCard from "./SessionCard";
import CheckoutDialog from "./CheckoutDialog";
import type { SessionWithDetails } from "../../context/SessionContext";
import { useSessions } from "../../context/SessionContext";

export default function SessionPage() {
  const [sessions, setSessions] = useState<SessionWithDetails[]>([]);
  const [checkoutSessionId, setCheckoutSessionId] =
    useState<number | null>(null);
  const [checkoutDone, setCheckoutDone] = useState(false);
  const [now, setNow] = useState(Date.now());

  const { timerStates, dismissPreAlert } =
    useSessions();

  // Smooth timer
  useEffect(() => {
    const id = setInterval(() => {
      setNow(Date.now());
    }, 250);

    return () => clearInterval(id);
  }, []);

  // Load sessions from database
  const loadSessions = useCallback(async () => {
    try {
      const data =
        await window.api.sessions.getAll();

      setSessions(data);
    } catch (error) {
      console.error(
        "Failed to load sessions:",
        error
      );
    }
  }, []);

  // Refresh sessions every 3 seconds
  useEffect(() => {
    loadSessions();

    const id = setInterval(() => {
      loadSessions();
    }, 3000);

    return () => clearInterval(id);
  }, [loadSessions]);

  // Auto checkout when timer expires
  useEffect(() => {
    const expired = sessions.find((s) => {
      if (!s.durationMinutes) return false;

      const endTime =
        new Date(s.startTime).getTime() +
        s.durationMinutes * 60000;

      return now >= endTime;
    });

    if (
      expired &&
      checkoutSessionId === null
    ) {
      setCheckoutSessionId(expired.id);
      setCheckoutDone(false);
    }
  }, [sessions, now, checkoutSessionId]);

  const openCheckout = (id: number) => {
    setCheckoutSessionId(id);
    setCheckoutDone(false);
  };

  const closeCheckout = () => {
    setCheckoutSessionId(null);
    setCheckoutDone(false);
  };

  const performCheckout = async () => {
    if (!checkoutSessionId) return;

    await window.api.sessions.finish(
      checkoutSessionId
    );

    setCheckoutDone(true);

    await loadSessions();
  };

  const removeSession = async (
    id: number
  ) => {
    setSessions((prev) =>
      prev.filter((s) => s.id !== id)
    );

    await loadSessions();
  };

  const checkoutSession =
    sessions.find(
      (x) => x.id === checkoutSessionId
    );

  const preAlertSessions =
    sessions.filter((s) => {
      const state = timerStates[s.id];

      return (
        state?.preAlert &&
        !state.alertDismissed
      );
    });

  return (
    <div>
      <Typography variant="h4">
        Active Sessions
      </Typography>

      <Typography
        color="text.secondary"
        sx={{ mb: 2 }}
      >
        View all active sessions
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns:
            "repeat(4, 1fr)",
          gap: 2,
        }}
      >
        {preAlertSessions.map((s) => (
          <Alert
            key={`prealert-${s.id}`}
            severity="warning"
            action={
              <IconButton
                size="small"
                onClick={() =>
                  dismissPreAlert(s.id)
                }
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            }
            sx={{
              gridColumn: "1 / -1",
              mb: 1,
            }}
          >
            {s.station.code} will be
            closed in 5 minutes
          </Alert>
        ))}

        {sessions.length === 0 && (
          <Typography color="text.secondary">
            No active sessions
          </Typography>
        )}

        {sessions.map((s) => (
          <SessionCard
            key={s.id}
            session={s}
            now={now}
            onCheckout={openCheckout}
          />
        ))}

        <CheckoutDialog
          open={!!checkoutSessionId}
          onClose={closeCheckout}
          session={
            checkoutSession ?? null
          }
          now={now}
          done={checkoutDone}
          onConfirm={performCheckout}
          onRemove={removeSession}
        />
      </Box>
    </div>
  );
}