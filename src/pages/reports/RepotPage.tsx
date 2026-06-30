import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem
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
  const [month, setMonth] = useState(
    new Date().getMonth() + 1
  );
  
  const [year] = useState(
    new Date().getFullYear()
  );
  const [report, setReport] = useState<SessionReport | null>(null);

  useEffect(() => {
    window.api.sessions
      .getReport(month, year)
      .then(setReport);
  }, [month, year]);

  const formatMmk = (value: number) => `${value.toLocaleString()} MMK`;
  const monthNames = [
    "Today",
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: { xs: "stretch", sm: "center" },
            justifyContent: "space-between",
            flexDirection: { xs: "column", sm: "row" },
            gap: 3,
          }}
        >
          <Box>
            <Typography variant="h4" fontWeight={700}>
              Reports
            </Typography>

            <Typography color="text.secondary" sx={{ mt: 1 }}>
              Business statistics and income from completed sessions.
            </Typography>
          </Box>

          <FormControl sx={{ minWidth: { xs: "100%", sm: 200 } }}>
            <InputLabel>Month</InputLabel>

            <Select
              value={month}
              label="Month"
              onChange={(e) =>
                setMonth(Number(e.target.value))
              }
              sx={{ borderRadius: 2 }}
            >
              <MenuItem value={0}>Today</MenuItem>
              <MenuItem value={1}>January</MenuItem>
              <MenuItem value={2}>February</MenuItem>
              <MenuItem value={3}>March</MenuItem>
              <MenuItem value={4}>April</MenuItem>
              <MenuItem value={5}>May</MenuItem>
              <MenuItem value={6}>June</MenuItem>
              <MenuItem value={7}>July</MenuItem>
              <MenuItem value={8}>August</MenuItem>
              <MenuItem value={9}>September</MenuItem>
              <MenuItem value={10}>October</MenuItem>
              <MenuItem value={11}>November</MenuItem>
              <MenuItem value={12}>December</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      <Typography
        color="text.secondary"
        sx={{ mt: 1, mb: 3 }}
      >
        {month === 0
          ? "Today's business report"
          : `Report for ${monthNames[month]} ${year}`}
      </Typography>

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
