import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavBar from "./components/ui/navbar/NavBar";
import Register from "./components/auth/register/Register";
import Login from "./components/auth/login/Login";
import Services from "./components/content/services/Services";
import CreateService from "./components/content/createservice/CreateService";
import Home from "./components/content/home/Home";
import Turns from "./components/content/turns/Turns";
import Protected from "./components/auth/protected/Protected";
import Locations from "./components/content/locations/Locations";
import NotFound from "./components/content/notfound/NotFound";
import Footer from "./components/ui/footer/Footer";
import AboutUs from "./components/content/aboutus/AboutUs";
import FAQ from "./components/content/FAQ/FAQ";
import Settings from "./components/content/settings/Settings";
import MyTurns from "./components/content/myturns/myTurns";

function App() {
  const [token, setToken] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const handleLogin = (token, isAdminFlag) => {
    setToken(token);
    setIsAdmin(isAdminFlag);
    localStorage.setItem("token", token);
    localStorage.setItem("isAdmin", isAdminFlag);
  };

  const handleLogout = () => {
    setToken(null);
    setIsAdmin(false);
    localStorage.removeItem("token");
    localStorage.removeItem("isAdmin");
  };

  useEffect(() => {
    try {
      const savedToken = localStorage.getItem("token");
      if (savedToken) {
        setToken(savedToken);
        const savedIsAdmin = localStorage.getItem("isAdmin") === "true";
        setIsAdmin(savedIsAdmin);
      }
    } catch (error) {
      console.error("Error al recuperar datos de localStorage", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="app-container">
      <BrowserRouter>
        <NavBar token={token} isAdmin={isAdmin} onLogout={handleLogout} />
        {message && (
          <div style={{ color: "red", textAlign: "center" }}>{message}</div>
        )}
        <main>
          <Routes>
            <Route path="*" element={<NotFound />} />
            <Route path="/" element={<Home />} />
            <Route path="/about-us" element={<AboutUs />} />
            <Route path="/locations" element={<Locations />} />
            <Route path="/faq" element={<FAQ />} />
            {!isAdmin && (
              <Route
                path="/my-turns"
                element={
                  <Protected isSignedIn={token} isLoading={isLoading}>
                    {" "}
                    <MyTurns />
                  </Protected>
                }
              />
            )}
            <Route
              path="/settings"
              element={
                <Protected isSignedIn={token} isLoading={isLoading}>
                  {" "}
                  <Settings />
                </Protected>
              }
            />
            <Route
              path="/register"
              element={<Register setMessage={setMessage} />}
            />
            <Route
              path="/login"
              element={<Login onLogin={handleLogin} setMessage={setMessage} />}
            />
            <Route
              path="/turns"
              element={
                <Protected isSignedIn={token} isLoading={isLoading}>
                  <Turns />
                </Protected>
              }
            />
            <Route
              path="/services"
              element={
                <Services
                  token={token}
                  isAdmin={isAdmin}
                  isLoading={isLoading}
                />
              }
            />
            <Route
              path="/create-service"
              element={
                <CreateService
                  token={token}
                  isAdmin={isAdmin}
                  setMessage={setMessage}
                />
              }
            />
          </Routes>
        </main>
      </BrowserRouter>
      <Footer />
    </div>
  );
}

export default App;
