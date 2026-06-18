import {
  Card,
  CardContent,
  Button,
  Chip,
  Typography,
} from "@mui/material";

interface Props {
  code: string;
  type: string;
}

export default function StationCard({
  code,
  type,
}: Props) {
  return (
    <Card
      sx={{
        borderRadius: 4,
        height: 220,
      }}
    >
      <CardContent>
        <Typography variant="h5">
          {code}
        </Typography>

        <div
          style={{
            display: "flex",
            gap: 8,
            marginTop: 12,
          }}
        >
          <Chip
            label={type}
            color={
              type === "PS4"
                ? "primary"
                : "secondary"
            }
          />

          <Chip
            label="Idle"
            color="success"
            variant="outlined"
          />
        </div>

        <Button
          variant="contained"
          fullWidth
          sx={{
            mt: 8,
            height: 50,
            borderRadius: 3,
          }}
        >
          Start
        </Button>
      </CardContent>
    </Card>
  );
}