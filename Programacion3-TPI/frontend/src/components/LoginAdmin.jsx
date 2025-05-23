import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function LoginAdmin({ onLogin, setMessage }) {
  const [form, setForm] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const res = await fetch("http://localhost:3000/login/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage(data.message || "Error en login");
      } else {
        onLogin(data, true);
        navigate("/servicios");
      }
    } catch {
      setMessage("Error en comunicación con servidor");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login Admin</h2>
      <input
        name="email"
        type="email"
        placeholder="Email"
        required
        onChange={handleChange}
      />
      <input
        name="password"
        type="password"
        placeholder="Contraseña"
        required
        onChange={handleChange}
      />
      <button type="submit">Entrar</button>
    </form>
  );
}

export default LoginAdmin;
