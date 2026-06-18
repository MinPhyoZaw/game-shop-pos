import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";

interface Props {
  children: React.ReactNode;
}

export default function MainLayout({ children }: Props) {
  return (
    <div style={{ display: "flex" }}>
      <Sidebar />

      <div style={{ flex: 1 }}>
        <Header />

        <div style={{ padding: 20 }}>
          {children}
        </div>
      </div>
    </div>
  );
}