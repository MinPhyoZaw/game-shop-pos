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
  Stack,
} from "@mui/material";
import { useEffect, useState } from "react";
import { getGames } from "../../services/gameService";

interface Props {
  open: boolean;
  onClose: () => void;
  stationId?: number;
  stationCode?: string;
  stationType?: string;
  hourlyRateMmk?: number;
  onStarted?: () => void;
}

interface GameOption {
  id: number;
  name: string;
  coverImage: string | null;
  platform: string;
}

export default function StartSessionModal({
  open,
  onClose,
  stationId,
  stationCode,
  stationType,
  hourlyRateMmk,
  onStarted,
}: Props) {
  const [games, setGames] = useState<GameOption[]>([]);
  const [gameId, setGameId] = useState<number | "">("");
  const [note, setNote] = useState("");
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getGames().then(setGames);
  }, []);

  const rate =
    hourlyRateMmk ??
    (stationType === "PS4" ? 3000 : stationType === "PS3" ? 2000 : 0);

  const totalMinutes = hours * 60 + minutes;

  const handleClose = () => {
    setGameId("");
    setNote("");
    setHours(0);
    setMinutes(0);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>
        Start Session {stationCode ? `- ${stationCode}` : ""}
      </DialogTitle>

      <DialogContent dividers>
        <FormControl fullWidth margin="normal">
          <InputLabel id="game-select-label">
            Game
          </InputLabel>

          <Select
            labelId="game-select-label"
            value={gameId}
            label="Game"
            onChange={(e) => setGameId(e.target.value as number)}
            sx={{ borderRadius: 2 }}
          >
            {games.map((g) => (
              <MenuItem key={g.id} value={g.id}>
                {g.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Typography
          variant="subtitle2"
          sx={{ mt: 2, mb: 1 }}
        >
          Session Timer
        </Typography>

        <Stack
          direction="row"
          spacing={1}
          flexWrap="wrap"
          sx={{ mb: 2 }}
        >
          <Button
            size="small"
            onClick={() => {
              setHours(0);
              setMinutes(30);
            }}
          >
            30m
          </Button>

          <Button
            size="small"
            onClick={() => {
              setHours(0);
              setMinutes(45);
            }}
          >
            45m
          </Button>

          <Button
            size="small"
            onClick={() => {
              setHours(1);
              setMinutes(0);
            }}
          >
            1h
          </Button>

          <Button
            size="small"
            onClick={() => {
              setHours(1);
              setMinutes(30);
            }}
          >
            1h 30m
          </Button>

          <Button
            size="small"
            onClick={() => {
              setHours(2);
              setMinutes(0);
            }}
          >
            2h
          </Button>
        </Stack>

        <Box
          sx={{
            display: "flex",
            gap: 2,
          }}
        >
          <TextField
            fullWidth
            label="Hours"
            type="number"
            value={hours}
            onChange={(e) =>
              setHours(
                Math.max(
                  0,
                  Number(e.target.value) || 0
                )
              )
            }
            inputProps={{
              min: 0,
            }}
          />

          <TextField
            fullWidth
            label="Minutes"
            type="number"
            value={minutes}
            onChange={(e) =>
              setMinutes(
                Math.min(
                  59,
                  Math.max(
                    0,
                    Number(e.target.value) || 0
                  )
                )
              )
            }
            inputProps={{
              min: 0,
              max: 59,
            }}
          />
        </Box>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mt: 1 }}
        >
          Duration: {hours}h {minutes}m
        </Typography>

        <TextField
          fullWidth
          label="Note (optional)"
          margin="normal"
          value={note}
          onChange={(e) =>
            setNote(e.target.value)
          }
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
          <Typography
            variant="subtitle2"
            color="text.secondary"
          >
            Rate
          </Typography>

          <Typography variant="h6">
            {rate > 0
              ? `${rate.toLocaleString()} MMK/hr`
              : "—"}
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose}>
          Cancel
        </Button>

        <Button
          variant="contained"
          disabled={!gameId || !stationId || submitting}
          onClick={async () => {
            if (!gameId || !stationId) return;

            setSubmitting(true);
            try {
              await window.api.sessions.create({
                stationId,
                gameId: gameId as number,
                note: note || undefined,
                hourlyRateMmkSnapshot: rate,
                durationMinutes: totalMinutes > 0 ? totalMinutes : undefined,
              });
              onStarted?.();
              handleClose();
            } finally {
              setSubmitting(false);
            }
          }}
        >
          Start Session
        </Button>
      </DialogActions>
    </Dialog>
  );
}
