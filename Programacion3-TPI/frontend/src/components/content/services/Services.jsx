import { useEffect, useState } from "react";
import { Alert, ListGroup, Modal, Button, Form } from "react-bootstrap";
import { XSquareFill, PencilSquare } from "react-bootstrap-icons";
import "./Services.css";

const Services = ({ token, isAdmin }) => {
  const [servicios, setServicios] = useState([]);
  const [message, setMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [variant, setVariant] = useState("danger");
  const [editingService, setEditingService] = useState(null);
  const [editForm, setEditForm] = useState({ serviceType: "", price: "" });

  useEffect(() => {
    const obtenerServicios = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/nuestrosservicios",
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
          setVariant("danger");
          setMessage(data.message || "Error al obtener servicios");
          return;
        }

        const data = await response.json();
        setServicios(Array.isArray(data) ? data : []);
      } catch (err) {
        setVariant("danger");
        setMessage("No se pudo conectar con el servidor");
      }
    };

    obtenerServicios();
  }, [token]);

  const deleteHandler = async (id, nombre) => {
    try {
      const res = await fetch(`http://localhost:3000/nuestrosservicios/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Error al borrar servicio");
        return;
      }

      setServicios(servicios.filter((s) => s.id !== id));
      setVariant("success");
      setMessage(`Se eliminó correctamente el servicio ${nombre}`);
    } catch {
      setVariant("danger");
      setMessage("Error al comunicarse con el servidor");
    }
  };

  const editHandler = (servicio) => {
    setEditingService(servicio);
    setEditForm({ serviceType: servicio.serviceType, price: servicio.price });
    setShowModal(true);
  };

  const editChangeHandler = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };
  const editSubmitHandler = async (e) => {
    e.preventDefault();

    const nombreNuevo = editForm.serviceType.trim().toLowerCase();
    const nombreRepetido = servicios.some(
      (s) =>
        s.id !== editingService.id &&
        s.serviceType.trim().toLowerCase() === nombreNuevo
    );

    if (nombreRepetido) {
      setVariant("danger");
      setMessage("Ya existe otro servicio con ese nombre.");
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:3000/nuestrosservicios/${editingService.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(editForm),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error al editar");

      setVariant("success");
      setMessage("Servicio editado correctamente");
      setShowModal(false);
      setServicios((prev) =>
        prev.map((s) =>
          s.id === editingService.id ? { ...s, ...editForm } : s
        )
      );
    } catch (err) {
      alert(err.message);
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
      <h2 className="section-title">Servicios disponibles</h2>

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

      {servicios.length === 0 ? (
        <p className="mt-4 text-muted">No hay servicios disponibles</p>
      ) : (
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
                <span className="ms-auto d-flex gap-2">
                  <PencilSquare
                    className="edit-button"
                    onClick={() => editHandler(servicio)}
                  />
                  <XSquareFill
                    className="delete-button"
                    onClick={() =>
                      deleteHandler(servicio.id, servicio.serviceType)
                    }
                  />
                </span>
              )}
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}

      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        centered
        dialogClassName="edit-modal-dialog"
        contentClassName="edit-modal-content"
      >
        <Modal.Header closeButton>
          <Modal.Title className="edit-modal-title">
            Editar Servicio
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={editSubmitHandler}>
            <Form.Group className="mb-3">
              <Form.Label className="edit-modal-label">
                Nombre del servicio
              </Form.Label>
              <Form.Control
                type="text"
                name="serviceType"
                value={editForm.serviceType}
                onChange={editChangeHandler}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="edit-modal-label">Precio</Form.Label>
              <Form.Control
                type="number"
                name="price"
                value={editForm.price}
                onChange={editChangeHandler}
                step="0.01"
              />
            </Form.Group>
            <div className="d-flex justify-content-end">
              <Button
                onClick={() => setShowModal(false)}
                className="button-cancel me-2"
              >
                Cancelar
              </Button>
              <Button className="button-custom" type="submit">
                Guardar cambios
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Services;
