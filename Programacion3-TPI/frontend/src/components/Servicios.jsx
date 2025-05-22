import React, { useEffect, useState } from "react";

const Servicios = ({ token }) => {
  const [servicios, setServicios] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const obtenerServicios = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/barberservices/nuestrosservicios",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          const data = await response.json();
          setError(data.message || "Error al obtener servicios");
          return;
        }

        const data = await response.json();
        setServicios(Array.isArray(data) ? data : []);
      } catch (err) {
        setError("");
      }
    };

    obtenerServicios();
  }, [token]);

  return (
    <div>
      <h2>Servicios disponibles</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <ul>
        {servicios.map((servicio) => (
          <li key={servicio.id}>
            {servicio.name} - ${servicio.price}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Servicios;
