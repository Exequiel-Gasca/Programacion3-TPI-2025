import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Alert } from "react-bootstrap";

function Register() {
  const [form, setForm] = useState({});
  const [variant, setVariant] = useState("danger");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const validateEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const validatePassword = (password) => {
    return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(password);
  };

  const validateNroTel = (nroTel) => {
    return /\d{10}$/.test(nroTel);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    const emptyForm = [];
    if (!form.name) emptyForm.push("Nombre");
    if (!form.lastName) emptyForm.push("Apellido");
    if (!form.nroTel) emptyForm.push("Número de Teléfono");
    if (!form.email) emptyForm.push("Email");
    if (!form.password) emptyForm.push("Contraseña");

    if (emptyForm.length > 0) {
      let mensaje = "";
      if (emptyForm.length === 1) {
        mensaje = `El campo "${emptyForm[0]}" no puede estar vacío.`;
      } else {
        const last = emptyForm.pop();
        mensaje = `Los campos "${emptyForm.join(
          '", "'
        )}" y "${last}" no pueden estar vacíos.`;
      }
      setVariant("danger");
      setMessage(mensaje);
      return;
    }

    if (!validateEmail(form.email)) {
      setVariant("danger");
      setMessage("El Email debe tener un formato válido.");
      return;
    }

    if (!validatePassword(form.password)) {
      setVariant("danger");
      setMessage(
        "La Contraseña debe tener al menos 8 caracteres y debe contener al menos un número y una letra."
      );
      return;
    }

    if (!validateNroTel(form.nroTel)) {
      setVariant("danger");
      setMessage("El numero de teléfono debe contener 10 dígitos.");
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, role: "user" }),
      });
      if (!res.ok) {
        const err = await res.json();
        setVariant("danger");
        setMessage(err.message || "Error en registro");
      } else {
        setVariant("success");
        setMessage("Registro exitoso, ya podés iniciar sesión");
        setTimeout(() => navigate("/login"), 1500);
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
      <h2 className="section-title">Registrarse</h2>

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
          <Form.Label style={{ fontWeight: 500 }}>Nombre</Form.Label>
          <Form.Control
            className="form-control-custom"
            name="name"
            type="text"
            placeholder="Nombre"
            onChange={handleChange}
            value={form.name || ""}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label style={{ fontWeight: 500 }}>Apellido</Form.Label>
          <Form.Control
            className="form-control-custom"
            name="lastName"
            type="text"
            placeholder="Apellido"
            onChange={handleChange}
            value={form.lastName || ""}
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
            value={form.nroTel || ""}
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
            value={form.email || ""}
          />
        </Form.Group>

        <Form.Group className="form mb-3">
          <Form.Label style={{ fontWeight: 500 }}>Contraseña</Form.Label>
          <Form.Control
            className="form-control-custom"
            name="password"
            type="password"
            placeholder="********"
            onChange={handleChange}
            value={form.password || ""}
          />
          <Form.Text style={{ color: "#56382E" }}>
            Las contraseñas deben tener al menos 8 caracteres e incluir al menos
            una letra y un número.
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
