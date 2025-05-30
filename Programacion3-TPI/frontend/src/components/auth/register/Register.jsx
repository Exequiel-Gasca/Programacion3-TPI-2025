import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button } from "react-bootstrap";

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
    <div className="d-flex flex-column align-items-center justify-content-center text-center">
      <h2 style={{ color: "#56382E" }}>Registrarse</h2>
      <Form className="form-container" onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label style={{ fontWeight: 500 }}>Nombre</Form.Label>
          <Form.Control
            className="form-control-custom"
            name="name"
            type="text"
            placeholder="Nombre"
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label style={{ fontWeight: 500 }}>Apellido</Form.Label>
          <Form.Control
            className="form-control-custom"
            name="apellido"
            type="text"
            placeholder="Apellido"
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label style={{ fontWeight: 500 }}>
            Número de Teléfono
          </Form.Label>
          <Form.Control
            className="form-control-custom"
            name="nroTel"
            type="text"
            placeholder="341 XXX XXXX"
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label style={{ fontWeight: 500 }}>Email</Form.Label>
          <Form.Control
            className="form-control-custom"
            name="email"
            type="email"
            placeholder="email@example.com"
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="form mb-3">
          <Form.Label style={{ fontWeight: 500 }}>Contraseña</Form.Label>
          <Form.Control
            className="form-control-custom"
            name="password"
            type="password"
            placeholder="*******"
            onChange={handleChange}
          />
          <Form.Text style={{ color: "#56382E" }}>
            Las contraseñas deben tener x caracteres
          </Form.Text>
        </Form.Group>
        <Button className="button-custom" type="submit">
          Registrarse
        </Button>
      </Form>
    </div>
  );
}

export default Register;
