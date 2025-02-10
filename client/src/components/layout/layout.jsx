import Navbar from "./Navbar";
import { Outlet, useNavigate } from "react-router-dom";

export default function Layout() {
  const navigate = useNavigate();

  return (
    <div>
      <Navbar onNavigate={navigate} />
      <main className="p-4">
        <Outlet />
      </main>
    </div>
  );
}
// Compare this snippet from client/src/pages/HomePage.jsx: 