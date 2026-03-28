import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";
import "./appLayout.css";

export function AppLayout() {
  return (
    <div className="app-layout">
      <Navbar />
      <main className="app-layout__main">
        <div className="page-container">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
