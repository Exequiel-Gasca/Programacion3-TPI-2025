import React, { useEffect, useState } from "react";

function ServiceList() {
  const [services, setServices] = useState([]);
  const [message, setMessage] = useState("");

  const loadServices = async () => {
    try {
      const res = await fetch("http://localhost:3000/nuestrosservicios");
      const data = await res.json();
      setServices(data);
    } catch {
      setMessage("Error cargando servicios");
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  return (
    <div>
      <h2>Servicios disponibles</h2>
      {message && <p style={{ color: "red" }}>{message}</p>}
      {services.length === 0 && <p>No hay servicios</p>}
      <ul>
        {services.map((s) => (
          <li key={s.id}>
            {s.name} - ${s.price}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ServiceList;
