import { useEffect, useState } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";

const Settings = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editField, setEditField] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:3000/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Error al obtener usuario");
        const data = await res.json();
        setUser(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchUser();
  }, []);

  const handleEditClick = (field) => {
    setEditField(field);
    setEditValue(user[field]);
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:3000/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          [editField]: editValue,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Error al guardar");
      }

      setUser((prev) => ({ ...prev, [editField]: editValue }));
      setSuccess(`Campo ${editField} actualizado`);
      setEditField(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handlePasswordChange = (e) => {
    setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError("");

    if (!passwordForm.currentPassword) {
      setPasswordError("Debés ingresar la contraseña actual.");
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError("Las nuevas contraseñas no coinciden.");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:3000/me/password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Error al actualizar contraseña");
      }

      setSuccess("Contraseña actualizada correctamente");
      setShowPasswordModal(false);
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      setPasswordError(err.message);
    }
  };

  if (!user) return <div>Cargando...</div>;

  return (
    <div className="p-4">
      <h2>Configuración de cuenta</h2>

      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      <div className="mb-3">
        <strong>Nombre:</strong>{" "}
        {editField === "name" ? (
          <>
            <input
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
            />
            <Button className="ms-2" onClick={handleSave}>
              Guardar
            </Button>
            <Button
              className="ms-2"
              variant="secondary"
              onClick={() => setEditField(null)}
            >
              Cancelar
            </Button>
          </>
        ) : (
          <>
            {user.name}
            <Button
              className="ms-2"
              variant="link"
              onClick={() => handleEditClick("name")}
            >
              Editar
            </Button>
          </>
        )}
      </div>

      <div className="mb-3">
        <strong>Apellido:</strong>{" "}
        {editField === "lastName" ? (
          <>
            <input
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
            />
            <Button className="ms-2" onClick={handleSave}>
              Guardar
            </Button>
            <Button
              className="ms-2"
              variant="secondary"
              onClick={() => setEditField(null)}
            >
              Cancelar
            </Button>
          </>
        ) : (
          <>
            {user.lastName}
            <Button
              className="ms-2"
              variant="link"
              onClick={() => handleEditClick("lastName")}
            >
              Editar
            </Button>
          </>
        )}
      </div>

      <div className="mb-3">
        <strong>Teléfono:</strong>{" "}
        {editField === "nroTel" ? (
          <>
            <input
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
            />
            <Button className="ms-2" onClick={handleSave}>
              Guardar
            </Button>
            <Button
              className="ms-2"
              variant="secondary"
              onClick={() => setEditField(null)}
            >
              Cancelar
            </Button>
          </>
        ) : (
          <>
            {user.nroTel}
            <Button
              className="ms-2"
              variant="link"
              onClick={() => handleEditClick("nroTel")}
            >
              Editar
            </Button>
          </>
        )}
      </div>

      <div className="">
        <strong>Contraseña:</strong>{" "}
        <input
          type="password"
          value="********"
          readOnly
          disabled
          style={{ width: "150px" }}
        />
        <Button
          className="ms-2"
          variant="link"
          onClick={() => setShowPasswordModal(true)}
        >
          Cambiar contraseña
        </Button>
      </div>

      <Modal
        show={showPasswordModal}
        onHide={() => setShowPasswordModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Cambiar contraseña</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {passwordError && <Alert variant="danger">{passwordError}</Alert>}
          <Form onSubmit={handlePasswordSubmit}>
            <Form.Group>
              <Form.Label>Contraseña actual</Form.Label>
              <Form.Control
                type="password"
                name="currentPassword"
                value={passwordForm.currentPassword}
                onChange={handlePasswordChange}
                required
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Nueva contraseña</Form.Label>
              <Form.Control
                type="password"
                name="newPassword"
                value={passwordForm.newPassword}
                onChange={handlePasswordChange}
                required
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Confirmar nueva contraseña</Form.Label>
              <Form.Control
                type="password"
                name="confirmPassword"
                value={passwordForm.confirmPassword}
                onChange={handlePasswordChange}
                required
              />
            </Form.Group>

            <div className="mt-3 d-flex justify-content-end">
              <Button
                variant="secondary"
                onClick={() => setShowPasswordModal(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" className="ms-2">
                Cambiar contraseña
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Settings;
