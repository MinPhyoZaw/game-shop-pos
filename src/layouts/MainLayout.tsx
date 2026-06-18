import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";

interface Props {
  children: React.ReactNode;
}

export default function MainLayout({ children }: Props) {
  return (
    <div className="app-shell">
      <Sidebar />

      <main className="app-main">
        <Header />

        <div className="app-content">{children}</div>
      </main>
    </div>
  );
}
