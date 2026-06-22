import {
  Box,
  Typography,
  Button,
} from "@mui/material";
import { Add } from "@mui/icons-material";

const games = [
  {
    id: 1,
    name: "Uncharted",
    coverImage: "/game-covers/uncharted.jpg",
  },
  {
    id: 2,
    name: "FarCry 6",
    coverImage: "/game-covers/farcry.jpg",
  },
  {
    id: 3,
    name: "GTA V",
    coverImage: "/game-covers/gta.jpg",
  },
  {
    id: 4,
    name: "PES",
    coverImage: "/game-covers/pes.jpg",
  },
  {
    id: 5,
    name: "Naruto",
    coverImage: "/game-covers/naruto.jpg",
  },
  {
    id: 6,
    name: "Resident Evil 4",
    coverImage: "/game-covers/resident-evil.jpg",
  },
];

export default function GamesPage() {
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
          <Typography
            variant="h4"
            fontWeight={700}
          >
            Games Catalog
          </Typography>

          <Typography color="text.secondary">
            Manage PlayStation games
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<Add />}
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
          gridTemplateColumns:
            "repeat(auto-fill, minmax(220px, 1fr))",
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

    backgroundImage: `url(${game.coverImage})`,
    backgroundSize: "cover",
    backgroundPosition: "center",

    transition: "all 0.25s ease",

    "&:hover": {
      transform: "translateY(-8px) scale(1.02)",
      boxShadow: "0 20px 40px rgba(0,0,0,0.25)",
    },
  }}
>
  {/* Blur Name Tag */}
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
      fontWeight={700}
      sx={{
        color: "black",
        textAlign: "center",
      }}
    >
      {game.name}
    </Typography>
  </Box>
</Box>
        ))}
      </Box>
    </Box>
  );
}