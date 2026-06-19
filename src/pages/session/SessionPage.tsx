import { Box, Typography, Card, CardContent, Button, Divider, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
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
  const [checkoutSessionId, setCheckoutSessionId] = useState<string | null>(null);
  const [checkoutDone, setCheckoutDone] = useState(false);

  const openCheckout = (id: string) => {
    setCheckoutSessionId(id);
    setCheckoutDone(false);
  };

  const closeCheckout = () => {
    setCheckoutSessionId(null);
    setCheckoutDone(false);
  };

  const performCheckout = () => {
    // Simulate checkout processing
    setCheckoutDone(true);
  };

  return (
    <div>
      <Typography variant="h4">Active Sessions</Typography>
      <Typography color="text.secondary" sx={{ mb: 2 }}>
        View all active sessions
      </Typography>

      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 2 }}>
        {sessions.length === 0 && (
          <Typography color="text.secondary">No active sessions</Typography>
        )}

        {sessions.map((s) => {
          const elapsedMs = Date.now() - s.startTime;
          const minutes = Math.ceil(elapsedMs / 60000);
          const ratePerMinute = s.stationType === "PS4" ? 50 : s.stationType === "PS3" ? Math.round(2000 / 60) : 0;
          const playCost = minutes * ratePerMinute;
          const itemsTotal = s.itemsTotalMmk || 0;
          const totalAmount = playCost + itemsTotal;

          return (
            <Card key={s.id} sx={{ borderRadius: 2 }}>
              <CardContent>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  <Typography variant="h6">{s.stationCode}</Typography>
                  <Typography color="text.secondary">{s.stationType}</Typography>

                  <Typography variant="body2">Started Time</Typography>
                  <Typography color="text.secondary">{new Date(s.startTime).toLocaleString()}</Typography>

                  <Typography sx={{ mt: 1 }}>Game name: <strong>{s.game}</strong></Typography>

                  <Divider sx={{ my: 1 }} />

                  <Typography>Duration</Typography>
                  <Typography color="text.secondary"><Duration start={s.startTime} /></Typography>

                  <Typography sx={{ mt: 1 }}>Item / Product qty: {s.items.reduce((a:any,b:any)=>a+b.qty,0)}</Typography>
                  <Typography>Total amount: {totalAmount.toLocaleString()} MMK</Typography>

                  <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
                    <Button variant="contained" color="primary" onClick={() => openCheckout(s.id)}>
                      Close
                    </Button>
                    <Button variant="outlined" color="secondary" onClick={() => openCheckout(s.id)}>
                      Checkout
                    </Button>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          );
        })}

        <Dialog open={!!checkoutSessionId} onClose={closeCheckout} maxWidth="xs" fullWidth>
          <DialogTitle>Checkout</DialogTitle>
          <DialogContent>
            {checkoutSessionId && (() => {
              const s = sessions.find(x => x.id === checkoutSessionId)!;
              const elapsedMs = Date.now() - s.startTime;
              const minutes = Math.ceil(elapsedMs / 60000);
              const ratePerMinute = s.stationType === "PS4" ? 50 : s.stationType === "PS3" ? Math.round(2000 / 60) : 0;
              const playCost = minutes * ratePerMinute;
              const itemsTotal = s.itemsTotalMmk || 0;
              const totalAmount = playCost + itemsTotal;

              return (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  <Typography>Station: {s.stationCode}</Typography>
                  <Typography>Game: {s.game}</Typography>
                  <Typography>Play Cost: {playCost.toLocaleString()} MMK</Typography>
                  <Typography>Items Total: {itemsTotal.toLocaleString()} MMK</Typography>
                  <Typography variant="h6">Total: {totalAmount.toLocaleString()} MMK</Typography>
                </Box>
              );
            })()}
          </DialogContent>
          <DialogActions>
            <Button onClick={closeCheckout}>Cancel</Button>
            {!checkoutDone && (
              <Button variant="contained" onClick={() => {
                performCheckout();
              }}>
                Checkout
              </Button>
            )}
            {checkoutDone && (
              <Button color="error" variant="contained" onClick={() => {
                removeSession(checkoutSessionId!);
                closeCheckout();
              }}>
                Confirm Close
              </Button>
            )}
          </DialogActions>
        </Dialog>
      </Box>
    </div>
  );
}
