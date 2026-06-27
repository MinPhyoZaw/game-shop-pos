import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
} from "@mui/material";
import {
  AttachMoney,
  SportsEsports,
  ShoppingBag,
} from "@mui/icons-material";
import { useEffect, useState } from "react";

interface SessionReport {
  totalIncome: number;
  playIncome: number;
  productIncome: number;
  totalSessions: number;
  byStation: Record<string, { playIncome: number; productIncome: number; sessions: number }>;
}

export default function ReportPage() {
  const [report, setReport] = useState<SessionReport | null>(null);

  useEffect(() => {
    window.api.sessions.getReport().then(setReport);
  }, []);

  const formatMmk = (value: number) => `${value.toLocaleString()} MMK`;

  return (
    <Box>
      <Box>
        <Typography variant="h4" fontWeight={700}>
          Reports
        </Typography>

        <Typography color="text.secondary" sx={{ mt: 1, mb: 3 }}>
          Business statistics and income from completed sessions.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 3 }}>
          <Card sx={{ borderRadius: 4 }}>
            <CardContent>
              <AttachMoney color="success" />
              <Typography color="text.secondary">
                Total Income
              </Typography>
              <Typography variant="h5" fontWeight={700}>
                {report ? formatMmk(report.totalIncome) : "—"}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 3 }}>
          <Card sx={{ borderRadius: 4 }}>
            <CardContent>
              <SportsEsports color="primary" />
              <Typography color="text.secondary">
                Total Sessions
              </Typography>
              <Typography variant="h5" fontWeight={700}>
                {report ? report.totalSessions : "—"}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 3 }}>
          <Card sx={{ borderRadius: 4 }}>
            <CardContent>
              <ShoppingBag color="warning" />
              <Typography color="text.secondary">
                Product Income
              </Typography>
              <Typography variant="h5" fontWeight={700}>
                {report ? formatMmk(report.productIncome) : "—"}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 3 }}>
          <Card sx={{ borderRadius: 4 }}>
            <CardContent>
              <SportsEsports color="info" />
              <Typography color="text.secondary">
                Play Income
              </Typography>
              <Typography variant="h5" fontWeight={700}>
                {report ? formatMmk(report.playIncome) : "—"}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
