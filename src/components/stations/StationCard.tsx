import { useEffect, useState } from "react";
import { Gamepad2 } from "lucide-react";
import {
  Card,
  CardContent,
  Button,
  Chip,
  Typography,
  Box,
  Alert,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import type { ActiveSession } from "../../context/SessionContext";
import { useSessions } from "../../context/SessionContext";

interface Props {
  code: string;
  type: string;
  onStart: () => void;
}

export default function StationCard({ code, type, onStart }: Props) {
  const { sessions, removeSession } = useSessions();
  const session = sessions.find((s) => s.stationCode === code);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!session) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [session]);

  const elapsedMs = session ? now - session.startTime : 0;
  const seconds = Math.floor(elapsedMs / 1000) % 60;
  const minutes = Math.floor(elapsedMs / 60000) % 60;
  const hours = Math.floor(elapsedMs / 3600000);
  const elapsed = `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

  const ratePerMinute =
    type === "PS4" ? 50 : type === "PS3" ? Math.round(2000 / 60) : 0;
  const estimatedCost = session
    ? Math.ceil(elapsedMs / 60000) * ratePerMinute
    : 0;

  return (
    <Card sx={{ borderRadius: 4 }}>
      <CardContent>
        <Box
  sx={{
    display: "flex",
    alignItems: "center",
    gap: 1,
  }}
>
  <Gamepad2
    size={28}
    color="#003791"
  />

  <Typography
    variant="h5"
    sx={{
      fontFamily: "PS4Font",
      fontSize: "2rem",
    }}
  >
    {code}
  </Typography>
</Box>

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
  session: ActiveSession;
  elapsed: string;
  estimatedCost: number;
  onCloseSession: () => void;
}) {
  const [openPane, setOpenPane] = useState(false);
  const { dismissPreAlert } = useSessions();
  const [openEndedDialog, setOpenEndedDialog] = useState(false);
  const [openCheckout, setOpenCheckout] = useState(false);
  const [checkoutDone, setCheckoutDone] = useState(false);

  // open ended dialog when session status becomes ended
  useEffect(() => {
    if (session.status === "ended") setOpenEndedDialog(true);
  }, [session.status]);
  return (
    <>
      <Box sx={{ mt: 2 }}>
        {/* Pre-alert box shown 5 minutes before auto-end */}
        {session.preAlert && !session.alertDismissed && session.endTime && (
          <Alert
            severity="warning"
            action={
              <IconButton
                size="small"
                onClick={() => dismissPreAlert(session.id)}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            }
            sx={{ mb: 1 }}
          >
            {session.stationCode} will be closed in{" "}
            {Math.max(0, Math.ceil((session.endTime - Date.now()) / 1000))}{" "}
            seconds
          </Alert>
        )}
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
          <Button
            variant="contained"
            fullWidth
            onClick={() => setOpenPane(true)}
          >
            Add Item
          </Button>

          <Button
            variant="outlined"
            fullWidth
            color="error"
            onClick={() => setOpenCheckout(true)}
          >
            Close
          </Button>
        </Box>
      </Box>

      <ProductsPane
        open={openPane}
        onClose={() => setOpenPane(false)}
        stationCode={session.stationCode}
      />

      <Dialog open={openEndedDialog} onClose={() => setOpenEndedDialog(false)}>
        <DialogTitle>Session Ended</DialogTitle>
        <DialogContent>
          <Typography>
            {session.stationCode} session time is up. Do checkout or cancel.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setOpenEndedDialog(false);
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              setOpenEndedDialog(false);
              setOpenCheckout(true);
            }}
          >
            Checkout
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openCheckout}
        onClose={() => setOpenCheckout(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Checkout</DialogTitle>
        <DialogContent>
          {(() => {
            const elapsedMs = Date.now() - session.startTime;
            const minutes = Math.ceil(elapsedMs / 60000);
            const ratePerMinute =
              session.stationType === "PS4"
                ? 50
                : session.stationType === "PS3"
                  ? Math.round(2000 / 60)
                  : 0;
            const playCost = minutes * ratePerMinute;
            const itemsTotal = session.itemsTotalMmk || 0;
            const totalAmount = playCost + itemsTotal;

            return (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <Typography>Station: {session.stationCode}</Typography>
                <Typography>Game: {session.game}</Typography>
                <Typography>
                  Play Cost: {playCost.toLocaleString()} MMK
                </Typography>
                <Typography>
                  Items Total: {itemsTotal.toLocaleString()} MMK
                </Typography>
                <Typography variant="h6">
                  Total: {totalAmount.toLocaleString()} MMK
                </Typography>
              </Box>
            );
          })()}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCheckout(false)}>Cancel</Button>
          {!checkoutDone && (
            <Button variant="contained" onClick={() => setCheckoutDone(true)}>
              Checkout
            </Button>
          )}
          {checkoutDone && (
            <Button
              color="error"
              variant="contained"
              onClick={() => {
                onCloseSession();
                setOpenCheckout(false);
                setCheckoutDone(false);
              }}
            >
              Confirm Close
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
}
