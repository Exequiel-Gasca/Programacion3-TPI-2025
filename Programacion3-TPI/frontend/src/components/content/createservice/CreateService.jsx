import { useState } from "react";
import { Form, Button } from "react-bootstrap";

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
    <div className="d-flex flex-column align-items-center justify-content-center text-center">
      <h2>Crear Servicio</h2>
      {message && <p style={{ color: "red" }}>{message}</p>}

      <Form className="form-container" onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label style={{ fontWeight: 500 }}>Nombre Servicio</Form.Label>
          <Form.Control
            className="form-control-custom"
            name="serviceType"
            type="text"
            placeholder="Nombre Servicio"
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="form mb-3">
          <Form.Label style={{ fontWeight: 500 }}>Precio</Form.Label>
          <Form.Control
            className="form-control-custom"
            name="price"
            type="number"
            placeholder="Precio"
            onChange={handleChange}
          />
        </Form.Group>
        <Button className="button-custom" type="submit">
          Crear Servicio
        </Button>
      </Form>
    </div>
  );
}

export default CreateService;
