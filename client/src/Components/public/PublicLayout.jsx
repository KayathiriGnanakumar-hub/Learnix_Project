import { Outlet } from "react-router-dom";
import Navbar from "../Navbar";
import Footer from "../Footer";

export default function PublicLayout() {
  return (
    <>
      <Navbar />
      <main style={{ backgroundColor: 'var(--site-bg)' }}>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}