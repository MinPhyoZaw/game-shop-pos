import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Divider,
  Switch,
  FormControlLabel,
} from "@mui/material";
import { useApp } from "../../context/AppContext";


export default function SettingPage() {
    const { darkMode, setDarkMode } = useApp();
  const { soundEnabled, setSoundEnabled } = useApp();

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 5 }}>
        <Typography variant="h4" fontWeight={700}>
          Settings
        </Typography>

        <Typography
          color="text.secondary"
          sx={{ mt: 1 }}
        >
          Manage your shop and application settings.
        </Typography>
      </Box>

      {/* Shop Information */}
      <Card sx={{ mb: 3, borderRadius: 4 }}>
        <CardContent>
          <Typography variant="h6" fontWeight={700}>
            Shop Information
          </Typography>

          <Divider sx={{ my: 2 }} />

          <TextField
            label="Shop Name"
            defaultValue="TK Family Game Shop"
            fullWidth
            sx={{ mb: 2 }}
          />

          <TextField
            label="Casher name"
            fullWidth
            sx={{ mb: 2 }}
          />

          
        </CardContent>
      </Card>

      {/* Station Rates */}
      <Card sx={{ mb: 3, borderRadius: 4 }}>
        <CardContent>
          <Typography variant="h6" fontWeight={700}>
            Station Rates
          </Typography>

          <Divider sx={{ my: 2 }} />

          <TextField
            label="PS4 Hourly Rate"
            defaultValue={3000}
            type="number"
            fullWidth
            sx={{ mb: 2 }}
          />

          <TextField
            label="PS3 Hourly Rate"
            defaultValue={2000}
            type="number"
            fullWidth
          />
        </CardContent>
      </Card>

      {/* Application */}
      <Card sx={{ mb: 3, borderRadius: 4 }}>
        <CardContent>
          <Typography variant="h6" fontWeight={700}>
            Application
          </Typography>

          <Divider sx={{ my: 2 }} />

          <FormControlLabel
            control={
              <Switch
                checked={soundEnabled}
                onChange={(event) => setSoundEnabled(event.target.checked)}
              />
            }
            label="Enable Sound Effects"
          />

          <FormControlLabel
  control={
    <Switch
      checked={darkMode}
      onChange={(e) =>
        setDarkMode(e.target.checked)
      }
    />
  }
  label="Dark Mode"
/>
        </CardContent>
      </Card>

      {/* Database */}
      {/* <Card sx={{ borderRadius: 4 }}>
        <CardContent>
          <Typography variant="h6" fontWeight={700}>
            Database
          </Typography>

          <Divider sx={{ my: 2 }} />

          <Button
            variant="outlined"
            sx={{ mr: 2 }}
          >
            Backup Database
          </Button>

          <Button
            variant="contained"
          >
            Save Settings
          </Button>
        </CardContent>
      </Card> */}
    </Box>
  );
}