import { useEffect, useState } from "react";
import { Alert, ListGroup } from "react-bootstrap";
import { XSquareFill } from "react-bootstrap-icons";
import "./Services.css";

const Services = ({ token, isAdmin }) => {
  const [servicios, setServicios] = useState([]);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

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

  const deleteHandler = async (id, nombre) => {
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
      setSuccessMessage(`Se eliminó correctamente el servicio ${nombre}`);
    } catch {
      alert("Error al comunicarse con el servidor");
    }
  };

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  return (
    <div className="d-flex flex-column align-items-center justify-content-center text-center">
      <h2 style={{ color: "#56382E" }}>Servicios disponibles</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {successMessage && (
        <Alert
          variant="success"
          onClose={() => setSuccessMessage("")}
          dismissible
          style={{
            position: "fixed",
            zIndex: 9999,
          }}
        >
          {successMessage}
        </Alert>
      )}

      <ListGroup className="service-container">
        {servicios.map((servicio) => (
          <ListGroup.Item
            className="service-item d-flex align-items-center"
            key={servicio.id}
          >
            <span style={{ marginRight: "150px" }}>
              {servicio.serviceType} - ${servicio.price}
            </span>
            {isAdmin && (
              <XSquareFill
                className="delete-button"
                onClick={() => deleteHandler(servicio.id, servicio.serviceType)}
              />
            )}
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
};

export default Services;
