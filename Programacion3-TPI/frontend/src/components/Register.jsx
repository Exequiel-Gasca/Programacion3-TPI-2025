import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register({ setMessage }) {
  const [form, setForm] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const res = await fetch("http://localhost:3000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const err = await res.json();
        setMessage(err.message || "Error en registro");
      } else {
        setMessage("Registro exitoso, ahora logueate");
        navigate("/login"); // redirige al login
      }
    } catch {
      setMessage("Error en comunicación con servidor");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Registrarse</h2>
      <input
        name="name"
        placeholder="Nombre"
        required
        onChange={handleChange}
      />
      <input
        name="lastName"
        placeholder="Apellido"
        required
        onChange={handleChange}
      />
      <input
        name="nroTel"
        placeholder="Teléfono"
        required
        onChange={handleChange}
      />
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
      <button type="submit">Registrarse</button>
    </form>
  );
}

export default Register;
