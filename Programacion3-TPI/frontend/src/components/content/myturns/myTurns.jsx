import React, { useEffect, useState } from "react";
import {
  Card,
  Spinner,
  Alert,
  Container,
  Button,
  Modal,
} from "react-bootstrap";

const MyTurns = () => {
  const [turns, setTurns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedTurnId, setSelectedTurnId] = useState(null);

  const formatDateDMY = (date) => {
    if (typeof date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
      const [year, month, day] = date.split("-");
      return `${day}/${month}/${year}`;
    }

    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("No estás autenticado");
      setLoading(false);
      return;
    }

    fetch("http://localhost:3000/turnos", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.message || "Error al obtener los turnos");
        }
        return res.json();
      })
      .then((data) => {
        console.log("Turnos recibidos:", data);
        setTurns(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const confirmCancel = (id) => {
    setSelectedTurnId(id);
    setShowModal(true);
  };

  const handleCancel = () => {
    const token = localStorage.getItem("token");
    if (!token || !selectedTurnId) return;

    fetch(`http://localhost:3000/turnos/${selectedTurnId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("No se pudo cancelar el turno");
        }
        setTurns((prev) => prev.filter((t) => t.id !== selectedTurnId));
        setShowModal(false);
        setSelectedTurnId(null);
      })
      .catch((err) => {
        alert(err.message);
        setShowModal(false);
        setSelectedTurnId(null);
      });
  };

  if (loading)
    return (
      <div className="d-flex justify-content-center py-5">
        <Spinner animation="border" role="status" />
      </div>
    );

  if (error)
    return (
      <Container className="py-4 text-center">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );

  if (turns.length === 0)
    return (
      <Container className="py-4 text-center">
        <Alert variant="info">No tenés turnos aún.</Alert>
      </Container>
    );

  return (
    <Container className="py-4 d-flex flex-column align-items-center">
      <h2 className="mb-4 text-center">Mis Turnos</h2>
      {turns.map((turn) => (
        <Card
          key={turn.id}
          className="mb-3 w-100 service-container"
          style={{ maxWidth: "500px" }}
        >
          <Card.Body>
            <Card.Title className="text-center">
              {turn.Barberservice?.serviceType || "Servicio desconocido"}
            </Card.Title>
            <Card.Text className="text-center" style={{ color: "#f5f5dc" }}>
              <strong>Fecha: </strong> {formatDateDMY(turn.date)}
              <br />
              <strong>Hora:</strong> {turn.time}:00 hs
            </Card.Text>

            <div className="d-flex justify-content-center">
              <Button
                className="button-cancel"
                onClick={() => confirmCancel(turn.id)}
                size="sm"
              >
                Cancelar turno
              </Button>
            </div>
          </Card.Body>
        </Card>
      ))}

      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        centered
        dialogClassName="edit-modal-dialog"
        contentClassName="edit-modal-content"
      >
        <Modal.Header closeButton>
          <Modal.Title className="edit-modal-title">Cancelar turno</Modal.Title>
        </Modal.Header>
        <Modal.Body className="edit-modal-label">
          ¿Estás seguro de que querés cancelar este turno?
        </Modal.Body>
        <Modal.Footer>
          <Button className="button-cancel" onClick={handleCancel}>
            Sí, cancelar
          </Button>
          <Button
            className="button-custom me-2"
            onClick={() => setShowModal(false)}
          >
            No
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default MyTurns;
