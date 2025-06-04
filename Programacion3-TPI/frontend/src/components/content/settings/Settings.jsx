import { useEffect, useState } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import { PencilSquare } from "react-bootstrap-icons";

const Settings = () => {
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");
  const [variant, setVariant] = useState("danger");
  const [editField, setEditField] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:3000/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Error al obtener usuario");
        const data = await res.json();
        setUser(data);
      } catch (err) {
        setVariant("danger");
        setMessage(err.message);
      }
    };

    fetchUser();
  }, []);

  const openEditModal = (field) => {
    setEditField(field);
    setEditValue(user[field]);
    setMessage("");
    setShowEditModal(true);
  };

  const handleSave = async () => {
    if (editValue === user[editField]) {
      setVariant("warning");
      setMessage("No hubo cambios");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:3000/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ [editField]: editValue }),
      });

      if (!res.ok) {
        const data = await res.json();
        setVariant("danger");
        throw new Error(data.message || "Error al guardar");
      }

      setUser((prev) => ({ ...prev, [editField]: editValue }));
      setVariant("success");
      setMessage(`Campo ${etiquetas[editField] || editField} actualizado`);
      setShowEditModal(false);
    } catch (err) {
      setVariant("danger");
      setMessage(err.message);
    }
  };

  const etiquetas = {
    name: "Nombre",
    lastName: "Apellido",
    nroTel: "Teléfono",
    email: "Email",
  };

  const handlePasswordChange = (e) => {
    setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!passwordForm.currentPassword) {
      setVariant("danger");
      setMessage("Debés ingresar la contraseña actual.");
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setVariant("danger");
      setMessage("Las nuevas contraseñas no coinciden.");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:3000/me", {
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

      setVariant("success");
      setMessage("Contraseña actualizada correctamente");
      setShowPasswordModal(false);
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      setVariant("danger");
      setMessage(err.message);
    }
  };

  const handlePasswordModalClose = () => {
    setShowPasswordModal(false);
    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  if (!user) return <div>Cargando...</div>;

  return (
    <div className="d-flex flex-column align-items-center justify-content-center text-center">
      <h2 className="section-title">Configuración de cuenta</h2>

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

      <div className="form-container w-75">
        {["name", "lastName", "nroTel", "email"].map((field) => (
          <div className="mb-3" key={field}>
            <strong>
              {field === "nroTel"
                ? "Teléfono"
                : field === "name"
                ? "Nombre"
                : field === "lastName"
                ? "Apellido"
                : "Email"}
              :
            </strong>{" "}
            <p className="d-flex align-items-center gap-2">
              <input
                className="w-100"
                type="text"
                value={user[field]}
                readOnly
                disabled
              />
              <PencilSquare
                className="edit-button"
                onClick={() => openEditModal(field)}
              />
            </p>
          </div>
        ))}

        <div className="mb-3">
          <strong>Contraseña:</strong>{" "}
          <p className="d-flex align-items-center gap-2">
            <input
              className="w-100"
              type="text"
              value={"*******"}
              readOnly
              disabled
            />
            <PencilSquare
              className="edit-button"
              onClick={() => setShowPasswordModal(true)}
            />
          </p>
        </div>
      </div>

      <Modal
        show={showEditModal}
        centered
        onHide={() => {
          setShowEditModal(false);
          setMessage("");
        }}
        dialogClassName="edit-modal-dialog"
        contentClassName="edit-modal-content"
      >
        <Modal.Header closeButton>
          <Modal.Title className="edit-modal-title">
            Editar {etiquetas[editField] || editField}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label className="edit-modal-label">Nuevo valor</Form.Label>
            <Form.Control
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              autoFocus
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button
            className="button-cancel me-2"
            onClick={() => {
              setShowEditModal(false);
              setMessage("");
            }}
          >
            Cancelar
          </Button>
          <Button className="button-custom" onClick={handleSave}>
            Guardar
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showPasswordModal}
        onHide={handlePasswordModalClose}
        centered
        dialogClassName="edit-modal-dialog"
        contentClassName="edit-modal-content"
      >
        <Modal.Header closeButton>
          <Modal.Title className="edit-modal-title">
            Cambiar contraseña
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handlePasswordSubmit}>
            <Form.Group>
              <Form.Label className="edit-modal-label">
                Contraseña actual
              </Form.Label>
              <Form.Control
                type="password"
                name="currentPassword"
                value={passwordForm.currentPassword}
                onChange={handlePasswordChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label className="edit-modal-label">
                Nueva contraseña
              </Form.Label>
              <Form.Control
                type="password"
                name="newPassword"
                value={passwordForm.newPassword}
                onChange={handlePasswordChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label className="edit-modal-label">
                Confirmar nueva contraseña
              </Form.Label>
              <Form.Control
                type="password"
                name="confirmPassword"
                value={passwordForm.confirmPassword}
                onChange={handlePasswordChange}
              />
            </Form.Group>
            <div className="mt-3 d-flex justify-content-end">
              <Button
                className="button-cancel me-2"
                onClick={handlePasswordModalClose}
              >
                Cancelar
              </Button>
              <Button type="submit" className="button-custom">
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
