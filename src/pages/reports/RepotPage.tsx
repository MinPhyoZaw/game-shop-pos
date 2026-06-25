import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Divider,
} from "@mui/material";
import {
  AttachMoney,
  SportsEsports,
  AccessTime,
  ShoppingBag,
} from "@mui/icons-material";

export default function ReportPage() {
  return (
    <Box>
      {/* Header */}
      <Box>
        <Typography variant="h4" fontWeight={700}>
          Reports
        </Typography>

        <Typography color="text.secondary"
          sx={{ mt: 1 , mb: 3 }}
          >
          Daily business statistics and income.
          
        </Typography>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 3 }}>
          <Card sx={{ borderRadius: 4 }}>
            <CardContent>
              <AttachMoney color="success" />
              <Typography color="text.secondary">
                Today's Income
              </Typography>
              <Typography variant="h5" fontWeight={700}>
                85,000 MMK
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 3 }}>
          <Card sx={{ borderRadius: 4 }}>
            <CardContent>
              <SportsEsports color="primary" />
              <Typography color="text.secondary">
                Sessions
              </Typography>
              <Typography variant="h5" fontWeight={700}>
                18
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 3 }}>
          <Card sx={{ borderRadius: 4 }}>
            <CardContent>
              <ShoppingBag color="warning" />
              <Typography color="text.secondary">
                Product Sales
              </Typography>
              <Typography variant="h5" fontWeight={700}>
                25,000 MMK
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 3 }}>
          <Card sx={{ borderRadius: 4 }}>
            <CardContent>
              <AccessTime color="info" />
              <Typography color="text.secondary">
                Play Hours
              </Typography>
              <Typography variant="h5" fontWeight={700}>
                32 Hours
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Sessions */}
     
      {/* Top Games */}
     
      {/* Product Sales */}
      
    </Box>
  );
}