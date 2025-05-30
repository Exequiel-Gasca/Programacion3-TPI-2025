import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button } from "react-bootstrap";

function Login({ onLogin, setMessage }) {
  const [form, setForm] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const res = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage(data.message || "Error en login");
      } else {
        onLogin(data.token, data.isAdmin);
        navigate("/turns");
      }
    } catch {
      setMessage("Error en comunicación con servidor");
    }
  };

  return (
    <div className="d-flex flex-column align-items-center justify-content-center text-center">
      <h2 style={{ color: "#56382E" }}>Iniciar Sesión</h2>

      <Form className="form-container" onSubmit={handleSubmit}>
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
        </Form.Group>
        <Button className="button-custom" type="submit">
          Iniciar Sesión
        </Button>
        <Button className="register-button" variant="link" href="/register">
          ¿No tenes usuario? Registrate acá
        </Button>
      </Form>
    </div>
  );
}

export default Login;
