import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Alert } from "react-bootstrap";

function Login({ onLogin }) {
  const [form, setForm] = useState({});
  const [variant, setVariant] = useState("danger");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const validateEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    const emptyForm = [];
    if (!form.email) emptyForm.push("Email");
    if (!form.password) emptyForm.push("Contraseña");

    if (emptyForm.length > 0) {
      const mensaje =
        emptyForm.length === 1
          ? `El campo "${emptyForm[0]}" no puede estar vacío.`
          : `Los campos "${emptyForm.join('" y "')}" no pueden estar vacíos.`;

      setVariant("danger");
      setMessage(mensaje);
      return;
    }

    if (!validateEmail(form.email)) {
      setVariant("danger");
      setMessage("El Email debe tener un formato válido.");
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok) {
        setVariant("danger");
        setMessage(data.message || "Error en login");
      } else {
        setVariant("success");
        setMessage("Login exitoso");
        onLogin(data.token, data.isAdmin);
        navigate("/turns");
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
  }, [message, setMessage]);

  return (
    <div className="d-flex flex-column align-items-center justify-content-center text-center">
      <h2 className="section-title">Iniciar Sesión</h2>

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

      <Form className="form-container" onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label style={{ fontWeight: 500 }}>Email</Form.Label>
          <Form.Control
            className="form-control-custom"
            name="email"
            type="text"
            placeholder="email@example.com"
            onChange={handleChange}
            value={form.email || ""}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label style={{ fontWeight: 500 }}>Contraseña</Form.Label>
          <Form.Control
            className="form-control-custom"
            name="password"
            type="password"
            placeholder="********"
            onChange={handleChange}
            value={form.password || ""}
          />
        </Form.Group>

        <Button className="button-custom" type="submit">
          Iniciar Sesión
        </Button>
        <Button className="register-button" variant="link" href="/register">
          ¿No tenés usuario? Registrate acá
        </Button>
      </Form>
    </div>
  );
}

export default Login;
