import { useEffect, useMemo, useState } from "react";
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
import type { SessionWithDetails } from "../../context/SessionContext";
import { useSessions } from "../../context/SessionContext";
import { getProducts } from "../../services/productService";
import type { Product } from "../../services/productService";
import { useSessionCalculations, useDuration } from "../../pages/session/useSessionCalculations";

interface Props {
  code: string;
  type: string;
  session?: SessionWithDetails;
  onStart: () => void;
  onRefresh: () => void;
}

export default function StationCard({ code, type, session, onStart, onRefresh }: Props) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!session) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [session]);

  const { playCost, itemsTotal, totalAmount } = useSessionCalculations(
    session ?? {
      id: 0,
      stationId: 0,
      gameId: 0,
      note: null,
      startTime: new Date().toISOString(),
      endTime: null,
      hourlyRateMmkSnapshot: 0,
      durationMinutes: null,
      playCostMmk: null,
      status: "running",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      items: [],
      game: { id: 0, name: "" },
      station: { id: 0, code, type },
    },
    now
  );

  const startTime = session ? new Date(session.startTime).getTime() : now;
  const duration = useDuration(startTime, now);

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
                {duration}
              </Typography>
            </Box>

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
                🎮 {session.game.name}
              </Typography>
            </Box>

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
                  {playCost.toLocaleString()}
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
                  {itemsTotal.toLocaleString()}
                </Typography>
              </Box>
            </Box>

            <StationCardActions
              session={session}
              playCost={playCost}
              itemsTotal={itemsTotal}
              totalAmount={totalAmount}
              now={now}
              onRefresh={onRefresh}
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

function ProductsList({
  session,
  onRefresh,
}: {
  session: SessionWithDetails;
  onRefresh: () => void;
}) {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    getProducts().then(setProducts);
  }, []);

  const addItem = async (product: Product) => {
    await window.api.sessions.addItem({
      sessionId: session.id,
      productId: product.id,
      unitPriceMmk: product.priceMmk,
    });
    onRefresh();
  };

  const changeItemQty = async (productId: number, qty: number) => {
    await window.api.sessions.changeItemQty({
      sessionId: session.id,
      productId,
      qty,
    });
    onRefresh();
  };

  return products.map((p) => {
    const qty = session.items.find((it) => it.productId === p.id)?.qty || 0;

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
              if (qty - 1 <= 0) changeItemQty(p.id, 0);
              else changeItemQty(p.id, qty - 1);
            }}
          >
            <RemoveIcon />
          </IconButton>

          <Typography>{qty}</Typography>

          <IconButton
            size="small"
            onClick={() => addItem(p)}
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
  playCost,
  itemsTotal,
  totalAmount,
  now,
  onRefresh,
}: {
  session: SessionWithDetails;
  playCost: number;
  itemsTotal: number;
  totalAmount: number;
  now: number;
  onRefresh: () => void;
}) {
  const [openPane, setOpenPane] = useState(false);
  const { dismissPreAlert, timerStates } = useSessions();
  const [openEndedDialog, setOpenEndedDialog] = useState(false);
  const [openCheckout, setOpenCheckout] = useState(false);
  const [checkoutDone, setCheckoutDone] = useState(false);

  const timerState = timerStates[session.id] || { preAlert: false, alertDismissed: false };

  const remainingMs = useMemo(() => {
    if (!session.durationMinutes) return null;
    const endTime = new Date(session.startTime).getTime() + session.durationMinutes * 60000;
    return endTime - now;
  }, [session, now]);

  useEffect(() => {
    if (remainingMs !== null && remainingMs <= 0) {
      setOpenEndedDialog(true);
    }
  }, [remainingMs]);

  const handleCheckout = async () => {
    await window.api.sessions.finish(session.id);
    setCheckoutDone(true);
    onRefresh();
  };

  const handleConfirmClose = () => {
    setOpenCheckout(false);
    setCheckoutDone(false);
    onRefresh();
  };

  return (
    <>
      <Box sx={{ mt: 2 }}>
        {timerState.preAlert && !timerState.alertDismissed && remainingMs !== null && (
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
            {session.station.code} will be closed in{" "}
            {Math.max(0, Math.ceil(remainingMs / 1000))}{" "}
            seconds
          </Alert>
        )}

        <Box sx={{ mt: 1, p: 1, border: "1px solid #e5e7eb", borderRadius: 1 }}>
          <Typography>{playCost.toLocaleString()} MMK</Typography>

          <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
            Current Items Total
          </Typography>
          <Typography>{itemsTotal.toLocaleString()} MMK</Typography>
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
          <ProductsList session={session} onRefresh={onRefresh} />
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
            {session.station.code} session time is up. Do checkout or cancel.
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
                {session.station.code}
              </Typography>
              <Typography color="text.secondary">🎮 {session.game.name}</Typography>
            </Box>

            {session.items.length > 0 && (
              <>
                <Typography variant="caption" color="text.secondary">
                  Products
                </Typography>
                {session.items.map((item) => (
                  <Box key={item.id} sx={{ display: "flex", justifyContent: "space-between", pl: 1 }}>
                    <Typography variant="body2">
                      {item.productName || `Product ${item.productId}`} x {item.qty}
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
                  {playCost.toLocaleString()} MMK
                </Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography color="text.secondary">Products Total</Typography>
                <Typography fontWeight={600}>
                  {itemsTotal.toLocaleString()} MMK
                </Typography>
              </Box>
            </Box>

            <Box sx={{ p: 2.5, borderRadius: 3, bgcolor: "#16a34a", color: "#fff", textAlign: "center" }}>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Total Amount
              </Typography>
              <Typography variant="h4" fontWeight={800}>
                {totalAmount.toLocaleString()}
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
            <Button variant="contained" onClick={handleCheckout}>
              Checkout
            </Button>
          )}
          {checkoutDone && (
            <Button
              color="error"
              variant="contained"
              onClick={handleConfirmClose}
            >
              Confirm Close
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
}
