import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import { Add, Image } from "@mui/icons-material";
import { useEffect, useState } from "react";

interface Game {
  id: number;
  name: string;
  coverImage: string | null;
}

const defaultCoverImage = "/game-covers/default.jpg";

export default function GamesPage() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [coverError, setCoverError] = useState("");
  const [isChoosingCover, setIsChoosingCover] = useState(false);
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadGames = async () => {
      try {
        const data = await window.api.games.getAll();
        setGames(data);
      } catch (error) {
        console.error("Failed to load games:", error);
      } finally {
        setLoading(false);
      }
    };

    loadGames();
  }, []);

  const resetForm = () => {
    setName("");
    setCoverImage("");
    setCoverError("");
    setIsChoosingCover(false);
  };

  const closeDialog = () => {
    resetForm();
    setOpen(false);
  };

  const chooseCover = async () => {
    setIsChoosingCover(true);
    setCoverError("");

    try {
      const selectedCover = await window.api.games.chooseCover();

      if (selectedCover) {
        setCoverImage(selectedCover);
      }
    } catch (error) {
      console.error("Failed to choose cover:", error);
      setCoverError("Could not copy the selected cover. Please try another image.");
    } finally {
      setIsChoosingCover(false);
    }
  };

  const saveGame = async () => {
    if (!name.trim() || !coverImage) {
      setCoverError("Choose a cover image before saving the game.");
      return;
    }

    try {
      await window.api.games.create({
        name: name.trim(),
        coverImage,
      });

      const updatedGames = await window.api.games.getAll();

      setGames(updatedGames);
      resetForm();
      setOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return (
      <Box>
        <Typography>Loading games...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Games Catalog
          </Typography>

          <Typography color="text.secondary">Manage PlayStation games</Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setOpen(true)}
          sx={{
            borderRadius: 3,
            px: 3,
            height: 48,
          }}
        >
          Add Game
        </Button>
      </Box>

      {/* Grid */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: 3,
        }}
      >
        {games.map((game) => (
          <Box
            key={game.id}
            sx={{
              position: "relative",
              height: 340,
              borderRadius: 4,
              overflow: "hidden",
              cursor: "pointer",
              bgcolor: "grey.200",

              transition: "all 0.25s ease",

              "&:hover": {
                transform: "translateY(-8px) scale(1.02)",
                boxShadow: "0 20px 40px rgba(0,0,0,0.25)",
              },
            }}
          >
            <Box
              component="img"
              src={game.coverImage || defaultCoverImage}
              alt={`${game.name} cover`}
              onError={(event) => {
                event.currentTarget.src = defaultCoverImage;
              }}
              sx={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
            <Box
              sx={{
                position: "absolute",
                bottom: 12,
                left: 12,
                right: 12,

                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",

                background: "rgba(255,255,255,0.15)",

                border: "1px solid rgba(255,255,255,0.2)",

                borderRadius: 3,

                px: 2,
                py: 1.5,
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  color: "black",
                  fontWeight: 700,
                  textAlign: "center",
                }}
              >
                {game.name}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>

      <Dialog open={open} onClose={closeDialog} fullWidth maxWidth="sm">
        <DialogTitle>Add Game</DialogTitle>

        <DialogContent>
          <TextField
            label="Game Name"
            fullWidth
            margin="normal"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <Box sx={{ mt: 2 }}>
            <Button
              variant="outlined"
              startIcon={<Image />}
              onClick={chooseCover}
              disabled={isChoosingCover}
            >
              {coverImage ? "Change Cover" : "Choose File"}
            </Button>

            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Images are copied to AppData/TK Family Game POS/covers and saved as
              a file URL.
            </Typography>

            {coverError && (
              <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                {coverError}
              </Typography>
            )}

            {coverImage && (
              <Box
                sx={{
                  mt: 2,
                  height: 220,
                  borderRadius: 3,
                  backgroundImage: `url(${coverImage})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  border: "1px solid rgba(0,0,0,0.12)",
                }}
              />
            )}
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={closeDialog}>Cancel</Button>

          <Button
            variant="contained"
            onClick={saveGame}
            disabled={!name.trim() || !coverImage}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
