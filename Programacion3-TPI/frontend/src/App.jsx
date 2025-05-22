import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavBar from "./components/ui/navbar/NavBar";
import Register from "./components/Register";
import LoginUser from "./components/LoginUser";
import LoginAdmin from "./components/LoginAdmin";
import Servicios from "./components/Servicios";
import CreateService from "./components/CreateService";
import BarberCarousel from "./components/ui/barbercarousel/BarberCarousel";

function App() {
  const [token, setToken] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [message, setMessage] = useState("");

  const handleLogin = (token, isAdminFlag) => {
    setToken(token);
    setIsAdmin(isAdminFlag);
    localStorage.setItem("token", token);
  };

  const handleLogout = () => {
    setToken(null);
    setIsAdmin(false);
    localStorage.removeItem("token");
  };

  return (
    <div>
      <BrowserRouter>
        <NavBar token={token} isAdmin={isAdmin} onLogout={handleLogout} />
        {message && (
          <div style={{ color: "red", textAlign: "center" }}>{message}</div>
        )}
        <Routes>
          <Route
            path="/register"
            element={<Register setMessage={setMessage} />}
          />
          <Route
            path="/login"
            element={
              <LoginUser onLogin={handleLogin} setMessage={setMessage} />
            }
          />
          <Route
            path="/login/admin"
            element={
              <LoginAdmin onLogin={handleLogin} setMessage={setMessage} />
            }
          />
          <Route path="/servicios" element={<Servicios token={token} />} />
          <Route
            path="/crear-servicio"
            element={
              <CreateService
                token={token}
                isAdmin={isAdmin}
                setMessage={setMessage}
              />
            }
          />
        </Routes>
      </BrowserRouter>

      <BarberCarousel />
    </div>
  );
}

export default App;
