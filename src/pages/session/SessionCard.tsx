import { Card, CardContent, Button, Typography, Box } from "@mui/material";
import type { ActiveSession } from "../../context/SessionContext";
import { useSessionCalculations, useDuration } from "./useSessionCalculations";

interface Props {
  session: ActiveSession;
  now: number;
  onCheckout: (id: string) => void;
}

export default function SessionCard({ session, now, onCheckout }: Props) {
  const { playCost, totalAmount } = useSessionCalculations(session, now);
  const duration = useDuration(session.startTime, now);

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
          <Typography variant="h4" fontWeight={700}>
            {duration}
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