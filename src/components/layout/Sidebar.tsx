import {
  LayoutDashboard,
  Clock3,
  Package,
  Gamepad2,
  FileText,
  Settings,
} from "lucide-react";

const menus = [
  { icon: LayoutDashboard, label: "Dashboard" },
  { icon: Clock3, label: "Sessions" },
  { icon: Package, label: "Products" },
  { icon: Gamepad2, label: "Games" },
  { icon: FileText, label: "Reports" },
  { icon: Settings, label: "Settings" },
];

export default function Sidebar() {
  return (
    <div
      style={{
        width: 280,
        background: "#fff",
        borderRight: "1px solid #e5e7eb",
        height: "100vh",
        padding: 20,
      }}
    >
      <h2>Game Shop POS</h2>

      <div style={{ marginTop: 30 }}>
        {menus.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.label}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "14px 16px",
                borderRadius: 12,
                marginBottom: 10,
                cursor: "pointer",
                background: item.label === "Dashboard"
                  ? "#eef2ff"
                  : "transparent",
              }}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}