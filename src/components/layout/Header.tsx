import { TextField } from "@mui/material";
import { useEffect, useState } from "react";

export default function Header() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <header className="topbar">
      <div className="cashier-card">
        <span>Cashier</span>
        <strong>John Doe</strong>
      </div>

      <TextField
        size="small"
        placeholder="Search stations, games, products..."
        className="topbar-search"
      />

      <time className="topbar-time" dateTime={now.toISOString()}>
        {now.toLocaleString()}
      </time>
    </header>
  );
}
