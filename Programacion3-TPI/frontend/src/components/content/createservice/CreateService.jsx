import React, { useState } from "react";

function CreateService({ token, onCreated }) {
  const [form, setForm] = useState({});
  const [message, setMessage] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const res = await fetch(
        "http://localhost:3000/api/barberservices/nuestrosservicios",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(form),
        }
      );
      if (!res.ok) {
        const err = await res.json();
        setMessage(err.message || "Error creando servicio");
      } else {
        setMessage("Servicio creado!");
        setForm({});
        if (onCreated) onCreated();
      }
    } catch {
      setMessage("Error en comunicación con servidor");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Crear Servicio</h2>
      {message && <p style={{ color: "red" }}>{message}</p>}
      <input
        name="serviceType"
        placeholder="Nombre Servicio"
        required
        onChange={handleChange}
      />
      <input
        name="price"
        type="number"
        placeholder="Precio"
        required
        onChange={handleChange}
      />
      <button type="submit">Crear</button>
    </form>
  );
}

export default CreateService;
