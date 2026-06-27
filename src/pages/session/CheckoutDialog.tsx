import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box, Divider } from "@mui/material";
import type { SessionWithDetails } from "../../context/SessionContext";
import { useSessionCalculations } from "./useSessionCalculations";

interface Props {
  open: boolean;
  onClose: () => void;
  session: SessionWithDetails | null;
  now: number;
  done: boolean;
  onConfirm: () => void;
  onRemove: (id: number) => void;
}

export default function CheckoutDialog({ open, onClose, session, now, done, onConfirm, onRemove }: Props) {
  if (!session) return null;

  const { playCost, itemsTotal, totalAmount } = useSessionCalculations(session, now);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
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
              <Typography fontWeight={600}>{playCost.toLocaleString()} MMK</Typography>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography color="text.secondary">Products Total</Typography>
              <Typography fontWeight={600}>{itemsTotal.toLocaleString()} MMK</Typography>
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
        <Button onClick={onClose}>Cancel</Button>
        {!done && (
          <Button variant="contained" onClick={onConfirm}>
            Checkout
          </Button>
        )}
        {done && (
          <Button color="error" variant="contained" onClick={() => {
            onRemove(session.id);
            onClose();
          }}>
            Confirm Close
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
