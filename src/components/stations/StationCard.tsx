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
  Divider,
  Drawer,
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import CloseIcon from "@mui/icons-material/Close";
import type { ActiveSession } from "../../context/SessionContext";
import { useSessions } from "../../context/SessionContext";
import { getProducts } from "../../services/productService";
import type { Product } from "../../services/productService";

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
  <Card
    sx={{
      borderRadius: 5,
      overflow: "hidden",
      border: session
        ? "2px solid #3b82f6"
        : "2px solid #22c55e",
      boxShadow: session
        ? "0 0 20px rgba(59,130,246,0.25)"
        : "0 0 20px rgba(34,197,94,0.15)",
      transition: "all .25s ease",
      background:
        "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)",
      "&:hover": {
        transform: "translateY(-4px)",
      },
    }}
  >
    <CardContent sx={{ p: 3 }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
          }}
        >
          <Gamepad2
            size={34}
            color={session ? "#3b82f6" : "#22c55e"}
          />

          <Typography
            sx={{
               fontFamily: "PS4Font",
    fontSize: "1.4rem",
    letterSpacing: "1px",
    lineHeight: 1,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
            }}
          >
            {code}
          </Typography>
        </Box>

        <Chip
          label={session ? "RUNNING" : "READY"}
          color={session ? "primary" : "success"}
          sx={{
            fontWeight: 700,
          }}
        />
      </Box>

      {/* Platform */}
      <Box sx={{ mb: 2 }}>
        <Chip
          label={type}
          color={type === "PS4" ? "primary" : "secondary"}
          sx={{
            fontWeight: 700,
          }}
        />
      </Box>

      {session ? (
        <>
          {/* Session Timer */}
          <Box
            sx={{
              textAlign: "center",
              p: 2,
              borderRadius: 3,
              bgcolor: "rgba(59,130,246,0.08)",
              border: "1px solid rgba(59,130,246,0.15)",
            }}
          >
            <Typography
              variant="caption"
              color="text.secondary"
            >
              SESSION TIME
            </Typography>

            <Typography
              sx={{
                fontSize: "2rem",
                fontWeight: 700,
                fontFamily: "monospace",
              }}
            >
              {elapsed}
            </Typography>
          </Box>

          {/* Current Game */}
          <Box
            sx={{
              mt: 2,
              p: 2,
              borderRadius: 3,
              bgcolor: "#f8fafc",
              border: "1px solid #e5e7eb",
            }}
          >
            <Typography
              variant="caption"
              color="text.secondary"
            >
              NOW PLAYING
            </Typography>

            <Typography
              sx={{
                mt: 0.5,
                fontWeight: 700,
              }}
            >
              🎮 {session.game}
            </Typography>
          </Box>

          {/* Cost Stats */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 1,
              mt: 2,
            }}
          >
            <Box
              sx={{
                p: 2,
                borderRadius: 3,
                bgcolor: "#eff6ff",
              }}
            >
              <Typography
                variant="caption"
                color="text.secondary"
              >
                Play Cost
              </Typography>

              <Typography
                sx={{
                  fontWeight: 700,
                }}
              >
                {estimatedCost.toLocaleString()}
              </Typography>
            </Box>

            <Box
              sx={{
                p: 2,
                borderRadius: 3,
                bgcolor: "#f0fdf4",
              }}
            >
              <Typography
                variant="caption"
                color="text.secondary"
              >
                Items
              </Typography>

              <Typography
                sx={{
                  fontWeight: 700,
                }}
              >
                {session.itemsTotalMmk.toLocaleString()}
              </Typography>
            </Box>
          </Box>

          <StationCardActions
            session={session}
            estimatedCost={estimatedCost}
            onCloseSession={() =>
              removeSession(session.id)
            }
          />
        </>
      ) : (
        <>
          <Box
            sx={{
              mt: 4,
              mb: 4,
              textAlign: "center",
            }}
          >
            <Typography
              variant="body2"
              color="text.secondary"
            >
              Station is ready for a new customer
            </Typography>
          </Box>

          <Button
            variant="contained"
            fullWidth
            sx={{
              height: 56,
              borderRadius: 4,
              fontWeight: 700,
              fontSize: "1rem",
              textTransform: "none",
            }}
            onClick={onStart}
          >
            Start Session
          </Button>
        </>
      )}
    </CardContent>
  </Card>
);
}

function ProductsList({ stationCode }: { stationCode: string }) {
  const [products, setProducts] = useState<Product[]>([]);
  const { sessions, addItem, changeItemQty } = useSessions();

  useEffect(() => {
    getProducts().then(setProducts);
  }, []);

  const session = sessions.find((s) => s.stationCode === stationCode);
  const sessionId = session?.id;

  return products.map((p) => {
    const qty = session?.items.find((it) => it.productId === p.id)?.qty || 0;

    return (
      <Box key={p.id} sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mt: 2 }}>
        <div>
          <Typography>{p.name}</Typography>
          <Typography variant="caption" color="text.secondary">{p.priceMmk.toLocaleString()} MMK</Typography>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <IconButton
            size="small"
            onClick={() => {
              if (!sessionId) return;
              if (qty - 1 <= 0) changeItemQty(sessionId, p.id, 0);
              else changeItemQty(sessionId, p.id, qty - 1);
            }}
          >
            <RemoveIcon />
          </IconButton>

          <Typography>{qty}</Typography>

          <IconButton
            size="small"
            onClick={() => {
              if (!sessionId) return;
              addItem(sessionId, { productId: p.id, name: p.name, unitPriceMmk: p.priceMmk });
            }}
          >
            <AddIcon />
          </IconButton>
        </div>
      </Box>
    );
  });
}

function StationCardActions({
  session,
  estimatedCost,
  onCloseSession,
}: {
  session: ActiveSession;
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
       

        <Box sx={{ mt: 1, p: 1, border: "1px solid #e5e7eb", borderRadius: 1 }}>
          
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

      <Drawer anchor="right" open={openPane} onClose={() => setOpenPane(false)}>
        <Box sx={{ width: 360, p: 2 }}>
          <Typography variant="h6">Products</Typography>
          <ProductsList stationCode={session.stationCode} />
          <Box sx={{ mt: 4 }}>
            <Button variant="contained" onClick={() => setOpenPane(false)} fullWidth>
              Done
            </Button>
          </Box>
        </Box>
      </Drawer>

      <Dialog open={openEndedDialog} onClose={() => setOpenEndedDialog(false)}>
        <DialogTitle>Session Ended</DialogTitle>
        <DialogContent>
          <Typography>
            {session.stationCode} session time is up. Do checkout or cancel.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEndedDialog(false)}>Cancel</Button>
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
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Box sx={{ p: 2, borderRadius: 3, bgcolor: "#f8fafc" }}>
              <Typography variant="caption" color="text.secondary">
                Station
              </Typography>
              <Typography variant="h6" fontWeight={700}>
                {session.stationCode}
              </Typography>
              <Typography color="text.secondary">🎮 {session.game}</Typography>
            </Box>

            {session.items.length > 0 && (
              <>
                <Typography variant="caption" color="text.secondary">
                  Products
                </Typography>
                {session.items.map((item) => (
                  <Box key={item.productId} sx={{ display: "flex", justifyContent: "space-between", pl: 1 }}>
                    <Typography variant="body2">
                      {item.name} x {item.qty}
                    </Typography>
                    <Typography variant="body2" fontWeight={500}>
                      {item.lineTotalMmk.toLocaleString()} MMK
                    </Typography>
                  </Box>
                ))}
                <Divider sx={{ my: 1 }} />
              </>
            )}

            <Box sx={{ p: 2, borderRadius: 3, border: "1px solid #e5e7eb" }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                <Typography color="text.secondary">Play Cost</Typography>
                <Typography fontWeight={600}>
                  {estimatedCost.toLocaleString()} MMK
                </Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography color="text.secondary">Products Total</Typography>
                <Typography fontWeight={600}>
                  {session.itemsTotalMmk.toLocaleString()} MMK
                </Typography>
              </Box>
            </Box>

            <Box sx={{ p: 2.5, borderRadius: 3, bgcolor: "#16a34a", color: "#fff", textAlign: "center" }}>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Total Amount
              </Typography>
              <Typography variant="h4" fontWeight={800}>
                {(estimatedCost + session.itemsTotalMmk).toLocaleString()}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                MMK
              </Typography>
            </Box>
          </Box>
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
