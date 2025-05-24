import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavBar from "./components/ui/navbar/NavBar";
import Register from "./components/Register";
import LoginUser from "./components/LoginUser";
import LoginAdmin from "./components/LoginAdmin";
import Servicios from "./components/Servicios";
import CreateService from "./components/CreateService";
import Home from "./components/content/home/Home";
import Turns from "./components/content/turns/Turns";
import Protected from "./components/auth/protected/Protected";
import Locations from "./components/content/locations/Locations";
import NotFound from "./components/content/notfound/NotFound";

function App() {
  const [token, setToken] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [message, setMessage] = useState("");
  const [loggedIn, setLoggedin] = useState(false);

  const handleLogin = (token, isAdminFlag) => {
    setLoggedin(true);
    setToken(token);
    setIsAdmin(isAdminFlag);
    localStorage.setItem("token", token);
    localStorage.setItem("isAdmin", isAdminFlag);
  };

  const handleLogout = () => {
    setToken(null);
    setIsAdmin(false);
    setLoggedin(false);
    localStorage.removeItem("token");
    localStorage.removeItem("isAdmin");
  };

  useEffect(() => {
    try {
      const savedToken = localStorage.getItem("token");
      if (savedToken) {
        setToken(savedToken);
        setLoggedin(true);
        const savedIsAdmin = localStorage.getItem("isAdmin") === "true";
        setIsAdmin(savedIsAdmin);
      }
    } catch (error) {
      console.error("Error al recuperar datos de localStorage", error);
    }
  }, []);

  return (
    <div>
      <BrowserRouter>
        <NavBar token={token} isAdmin={isAdmin} onLogout={handleLogout} />
        {message && (
          <div style={{ color: "red", textAlign: "center" }}>{message}</div>
        )}
        <Routes>
          <Route path="*" element={<NotFound />} />
          <Route path="/" element={<Home />} />
          <Route path="/locations" element={<Locations />} />
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
            path="/turns"
            element={
              <Protected isSignedIn={!!token}>
                <Turns />
              </Protected>
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
    </div>
  );
}

export default App;
