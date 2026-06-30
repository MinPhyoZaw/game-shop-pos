import {
  LayoutDashboard,
  Clock3,
  Package,
  Gamepad2,
  FileText,
  Settings,
} from "lucide-react";
import { type Page, useApp } from "../../context/AppContext";
import logo from "../../assets/lotk.png";

const menus = [
  { icon: LayoutDashboard, label: "Dashboard" },
  { icon: Clock3, label: "Sessions" },
  { icon: Package, label: "Products" },
  { icon: Gamepad2, label: "Games" },
  { icon: FileText, label: "Reports" },
  { icon: Settings, label: "Settings" },
];

export default function Sidebar() {
  const { page, setPage, shopSettings } = useApp();

  return (
    <aside className="sidebar">
      <div className="brand">
      <div className="brand-mark">
  <img
    src={logo}
    alt="TK Family Logo"
    className="brand-logo"
  />
</div>
        <div>
          <h2>{shopSettings.shopName} POS</h2>
          <span>Counter console</span>
        </div>
      </div>

      <nav className="sidebar-nav" aria-label="Main navigation">
        {menus.map((item) => {
          const Icon = item.icon;
          const isActive = item.label === page;

          return (
            <button
              key={item.label}
              type="button"
              onClick={() => setPage(item.label as Page)}
              className={isActive ? "nav-item active" : "nav-item"}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
