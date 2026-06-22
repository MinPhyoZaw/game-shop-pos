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
        <strong>Zin Min Oo</strong>
      </div>

      {/* Brand */}
      <div
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <h2
          style={{
            margin: 0,
            fontSize: "1.5rem",
            fontWeight: 800,
            letterSpacing: "0.5px",
            color: "#1976d2",
          }}
        >
          🎮 TKFamily Game Shop
        </h2>
      </div>

      <time className="topbar-time" dateTime={now.toISOString()}>
        {now.toLocaleString()}
      </time>
    </header>
  );
}