import { useState, useEffect } from "react";
import { Form, Button, Alert } from "react-bootstrap";

function CreateService({ token, onCreated }) {
  const [form, setForm] = useState({});
  const [message, setMessage] = useState("");
  const [variant, setVariant] = useState("danger");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    const emptyForm = [];
    if (!form.serviceType) emptyForm.push("Nombre Servicio");
    if (!form.price) emptyForm.push("Precio");

    if (emptyForm.length > 0) {
      const mensaje =
        emptyForm.length === 1
          ? `El campo "${emptyForm[0]}" no puede estar vacío.`
          : `Los campos "${emptyForm.join('" y "')}" no pueden estar vacíos.`;

      setVariant("danger");
      setMessage(mensaje);
      return;
    }

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

      const data = await res.json();

      if (!res.ok) {
        setVariant("danger");
        setMessage(data.message || "Error creando servicio");
      } else {
        setVariant("success");
        setMessage("¡Servicio creado con éxito!");
        setForm({});
        if (onCreated) onCreated();
      }
    } catch {
      setVariant("danger");
      setMessage("Error en comunicación con servidor");
    }
  };

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <div className="d-flex flex-column align-items-center justify-content-center text-center">
      <h2 className="section-title">Crear Servicio</h2>

      {message && (
        <Alert
          variant={variant}
          className="w-75"
          onClose={() => setMessage("")}
          dismissible
          style={{
            position: "fixed",
            top: "110px",
            zIndex: 9999,
          }}
        >
          {message}
        </Alert>
      )}

      <Form className="form-container w-75" onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label style={{ fontWeight: 500 }}>Nombre Servicio</Form.Label>
          <Form.Control
            className="form-control-custom"
            name="serviceType"
            type="text"
            placeholder="Nombre Servicio"
            onChange={handleChange}
            value={form.serviceType || ""}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label style={{ fontWeight: 500 }}>Precio</Form.Label>
          <Form.Control
            className="form-control-custom"
            name="price"
            type="number"
            placeholder="Precio"
            onChange={handleChange}
            value={form.price || ""}
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
