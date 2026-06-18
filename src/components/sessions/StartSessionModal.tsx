import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { getGames } from "../../services/gameService";
import { useSessions } from "../../context/SessionContext";

interface Props {
  open: boolean;
  onClose: () => void;
  stationCode?: string;
  stationType?: string;
}

export default function StartSessionModal({
  open,
  onClose,
  stationCode,
  stationType,
}: Props) {
  const [games, setGames] = useState<string[]>([]);
  const [game, setGame] = useState("");
  const [note, setNote] = useState("");

  useEffect(() => {
    getGames().then(setGames);
  }, []);

  const rate =
    stationType === "PS4"
      ? 3000
      : stationType === "PS3"
      ? 2000
      : 0;

  const { addSession } = useSessions();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>
        Start Session {stationCode ? `- ${stationCode}` : ""}
      </DialogTitle>

      <DialogContent
        dividers
        sx={{
          overflowY: "auto",
        }}
      >
        <FormControl fullWidth margin="normal">
          <InputLabel id="game-select-label">Game</InputLabel>

          <Select
            labelId="game-select-label"
            value={game}
            label="Game"
            onChange={(e) => setGame(e.target.value as string)}
            sx={{ borderRadius: 2 }}
          >
            {games.map((g) => (
              <MenuItem key={g} value={g}>
                {g}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          fullWidth
          label="Note (optional)"
          margin="normal"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          variant="outlined"
        />

        <Box
          sx={{
            mt: 2,
            p: 2,
            border: "1px solid #e5e7eb",
            borderRadius: 2,
            display: "flex",
            flexDirection: "column",
            gap: 0.5,
          }}
        >
          <Typography variant="subtitle2" color="text.secondary">
            Rate
          </Typography>

          <Typography variant="h6">
            {rate > 0 ? `${rate.toLocaleString()} MMK/hr` : "—"}
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>
          Cancel
        </Button>

        <Button
          variant="contained"
          disabled={!game}
          onClick={() => {
            if (!game || !stationCode) return;
            addSession({ stationCode, stationType, game, note });
            onClose();
          }}
        >
          Start Session
        </Button>
      </DialogActions>
    </Dialog>
  );
}