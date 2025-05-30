import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { X } from "react-bootstrap-icons";
import "./Services.css";

const Services = ({ token, isAdmin }) => {
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
        setError("No se pudo conectar con el servidor");
      }
    };

    obtenerServicios();
  }, [token]);

  const deleteHandler = async (id) => {
    try {
      const res = await fetch(
        `http://localhost:3000/api/barberservices/nuestrosservicios/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Error al borrar servicio");
        return;
      }

      setServicios(servicios.filter((s) => s.id !== id));
    } catch {
      alert("Error al comunicarse con el servidor");
    }
  };

  return (
    <div>
      <h2>Servicios disponibles</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <ul>
        {servicios.map((servicio) => (
          <li key={servicio.id}>
            {servicio.serviceType} - ${servicio.price}
            {isAdmin && (
              <X
                style={{ color: "red" }}
                onClick={() => deleteHandler(servicio.id)}
              />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Services;
