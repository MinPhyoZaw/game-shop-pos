import { useEffect, useState } from "react";
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
  CircularProgress,
  Alert,
} from "@mui/material";
import { useApp } from "../../context/AppContext";

export default function SettingPage() {
  const {
    darkMode,
    setDarkMode,
    soundEnabled,
    setSoundEnabled,
    shopSettings,
    saveShopSettings,
  } = useApp();
  const [shopName, setShopName] = useState(shopSettings.shopName);
  const [cashierName, setCashierName] = useState(shopSettings.cashierName);
  const [ps4Rate, setPs4Rate] = useState(3000);
  const [ps3Rate, setPs3Rate] = useState(2000);
  const [savingShop, setSavingShop] = useState(false);
  const [savingRates, setSavingRates] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    window.api.stations.getAll().then((stations) => {
      const ps4 = stations.find((station) => station.type === "PS4");
      const ps3 = stations.find((station) => station.type === "PS3");

      if (ps4) setPs4Rate(ps4.hourlyRateMmk);
      if (ps3) setPs3Rate(ps3.hourlyRateMmk);
    });
  }, []);

  const showSavedMessage = (text: string) => {
    setMessage(text);
    window.setTimeout(() => setMessage(""), 2500);
  };

  const handleSaveShop = async () => {
    setSavingShop(true);
    try {
      await new Promise((resolve) => window.setTimeout(resolve, 350));
      saveShopSettings({
        shopName: shopName.trim() || shopSettings.shopName,
        cashierName: cashierName.trim() || shopSettings.cashierName,
      });
      showSavedMessage("Shop information saved.");
    } finally {
      setSavingShop(false);
    }
  };

  const handleSaveRates = async () => {
    setSavingRates(true);
    try {
      await window.api.stations.updateRatesByType({
        PS4: ps4Rate,
        PS3: ps3Rate,
      });
      showSavedMessage("Station rates saved. Running and new sessions will use the updated hourly rate.");
    } finally {
      setSavingRates(false);
    }
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 5 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Settings
        </Typography>

        <Typography color="text.secondary" sx={{ mt: 1 }}>
          Manage your shop and application settings.
        </Typography>
      </Box>

      {message && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {message}
        </Alert>
      )}

      {/* Shop Information */}
      <Card sx={{ mb: 3, borderRadius: 4 }}>
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Shop Information
          </Typography>

          <Divider sx={{ my: 2 }} />

          <TextField
            label="Shop Name"
            value={shopName}
            onChange={(event) => setShopName(event.target.value)}
            fullWidth
            sx={{ mb: 2 }}
          />

          <TextField
            label="Cashier name"
            value={cashierName}
            onChange={(event) => setCashierName(event.target.value)}
            fullWidth
            sx={{ mb: 2 }}
          />

          <Button
            variant="contained"
            onClick={handleSaveShop}
            disabled={savingShop}
            startIcon={savingShop ? <CircularProgress color="inherit" size={18} /> : null}
          >
            {savingShop ? "Saving..." : "Save Shop Information"}
          </Button>
        </CardContent>
      </Card>

      {/* Station Rates */}
      <Card sx={{ mb: 3, borderRadius: 4 }}>
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Station Rates
          </Typography>

          <Divider sx={{ my: 2 }} />

          <TextField
            label="PS4 Hourly Rate"
            value={ps4Rate}
            onChange={(event) => setPs4Rate(Math.max(0, Number(event.target.value) || 0))}
            type="number"
            fullWidth
            sx={{ mb: 2 }}
            slotProps={{ htmlInput: { min: 0 } }}
          />

          <TextField
            label="PS3 Hourly Rate"
            value={ps3Rate}
            onChange={(event) => setPs3Rate(Math.max(0, Number(event.target.value) || 0))}
            type="number"
            fullWidth
            sx={{ mb: 2 }}
            slotProps={{ htmlInput: { min: 0 } }}
          />

          <Button
            variant="contained"
            onClick={handleSaveRates}
            disabled={savingRates}
            startIcon={savingRates ? <CircularProgress color="inherit" size={18} /> : null}
          >
            {savingRates ? "Saving..." : "Save Station Rates"}
          </Button>
        </CardContent>
      </Card>

      {/* Application */}
      <Card sx={{ mb: 3, borderRadius: 4 }}>
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
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
              <Switch checked={darkMode} onChange={(e) => setDarkMode(e.target.checked)} />
            }
            label="Dark Mode"
          />
        </CardContent>
      </Card>
    </Box>
  );
}
