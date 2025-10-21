/**
 * ============================================
 * Componente Principal de la App
 * ============================================
 */

import { Routes, Route } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LandingPage from "@/pages/LandingPage";
import AboutUs from "@/pages/AboutUs";
import Contact from "@/pages/Contact";
import Profile from "@/pages/Profile";
import GraphicDesign from "@/pages/GraphicDesign";
import CustomClothing from "@/pages/CustomClothing";
import Murals from "@/pages/Murals";
import ShoppingCart from "@/pages/ShoppingCart";
import ProtectedRoute from "./components/ProtectedRoute";
import GuestRoute from "./components/GuestRoute";
import "./css/App.css";

// Componente principal
function App() {
  return (
    <div className="App-container">
      {/* Header */}
      <Header />
      {/* Main */}
      <main className="App-mainContent">
        {/* Rutas */}
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/graphic-design" element={<GraphicDesign />} />
          <Route path="/custom-clothing" element={<CustomClothing />} />
          <Route path="/murals" element={<Murals />} />
          {/* Rutas para invitados */}
          <Route element={<GuestRoute />}>
            <Route path="/profile" element={<Profile />} />
          </Route>
          {/* Rutas protegidas */}
          <Route element={<ProtectedRoute />}>
            <Route path="/cart" element={<ShoppingCart />} />
          </Route>
        </Routes>
      </main>
      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;
