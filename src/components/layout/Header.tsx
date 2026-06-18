import { TextField } from "@mui/material";

export default function Header() {
  return (
    <div
      style={{
        height: 80,
        background: "#fff",
        borderBottom: "1px solid #e5e7eb",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 24px",
      }}
    >
      <div>
        <div>Cashier</div>
        <strong>John Doe</strong>
      </div>

      <TextField
        size="small"
        placeholder="Search..."
      />

      <div>
        {new Date().toLocaleString()}
      </div>
    </div>
  );
}