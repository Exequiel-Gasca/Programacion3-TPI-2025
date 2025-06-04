import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "react-calendar/dist/Calendar.css";
import "./Turns.css";
import Calendar from "react-calendar";
import {
  Form,
  Container,
  Row,
  ListGroup,
  Alert,
  Button,
} from "react-bootstrap";

function Turn() {
  const navigate = useNavigate();
  const [barberservices, setBarberservices] = useState([]);
  const [selectedService, setSelectedService] = useState("");
  const [turnos, setTurnos] = useState([]);
  const [message, setMessage] = useState("");
  const [variant, setVariant] = useState("danger");
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState("");

  const token = localStorage.getItem("token");
  const isAdmin = localStorage.getItem("isAdmin") === "true";

  const generateHours = (selectedDate) => {
    const day = selectedDate.getDay();
    let start, end;
    if (day === 6) {
      start = 10;
      end = 14;
    } else {
      start = 8;
      end = 16;
    }
    const hours = [];
    for (let h = start; h <= end; h++) {
      hours.push(h);
    }
    return hours;
  };

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

  const turnosDelDia = turnos.filter(
    (t) => formatDateDMY(t.date) === formatDateDMY(date)
  );

  const hours = generateHours(date);
  const reservedHours = turnosDelDia.map((t) => t.time);
  const availableHours = hours.filter((h) => !reservedHours.includes(h));

  useEffect(() => {
    if (time && !availableHours.includes(Number(time))) {
      setTime("");
    }
  }, [date]);

  useEffect(() => {
    fetch("http://localhost:3000/nuestrosservicios")
      .then((res) => res.json())
      .then((data) => setBarberservices(data))
      .catch(() => {
        setVariant("danger");
        setMessage("Error al cargar servicios");
      });
  }, []);

  useEffect(() => {
    const obtenerTurnos = async () => {
      try {
        const response = await fetch("http://localhost:3000/turnos", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const data = await response.json();
          setVariant("danger");
          setMessage(data.message || "Error al obtener turnos");
          return;
        }

        const data = await response.json();
        setTurnos(Array.isArray(data) ? data : []);
      } catch (err) {
        setVariant("danger");
        setMessage("No se pudo conectar con el servidor");
      }
    };

    if (token) obtenerTurnos();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!token) {
      setVariant("danger");
      return setMessage("No estás logueado");
    }

    if (!time) {
      setVariant("danger");
      return setMessage("Seleccioná un horario");
    }

    if (!selectedService) {
      setVariant("danger");
      return setMessage("Seleccioná un servicio");
    }

    try {
      const res = await fetch("http://localhost:3000/turnos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          date: date.toISOString(),
          time: Number(time),
          barberserviceId: selectedService,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setVariant("danger");
        throw new Error(data.message || "Error al crear el turno");
      }

      setTime("");
      setSelectedService("");
      setVariant("success");
      setMessage("Turno agendado con éxito");

      const response = await fetch("http://localhost:3000/turnos", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setTurnos(Array.isArray(data) ? data : []);
      }

      setTimeout(() => {
        setMessage("");
        navigate("/");
      }, 1000);
    } catch (err) {
      setMessage(err.message);
    }
  };

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const tileDisabled = ({ date: tileDate }) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tileDay = tileDate.getDay();

    if (tileDay === 0) return true;
    if (!isAdmin && tileDate < today) return true;
    return false;
  };

  return (
    <div className="d-flex flex-column align-items-center justify-content-center text-center">
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

      {isAdmin && (
        <div className="d-flex flex-column align-items-center justify-content-center text-center">
          <h2 className="section-title">Turnos por Día</h2>

          <Calendar
            onChange={(newDate) => {
              setDate(newDate);
            }}
            value={date}
            tileDisabled={tileDisabled}
            tileContent={({ date, view }) => {
              if (view === "month") {
                const tieneTurnos = turnos.some(
                  (t) => formatDateDMY(new Date(t.date)) === formatDateDMY(date)
                );
                return tieneTurnos ? <div className="dot" /> : null;
              }
              return null;
            }}
          />

          <h5 className="mt-3">Turnos del {formatDateDMY(date)}</h5>

          <ListGroup className="service-container">
            {turnosDelDia.length > 0 ? (
              turnosDelDia.map((turns) => (
                <ListGroup.Item
                  className="service-item d-flex justify-content-center align-items-center"
                  key={turns.id}
                >
                  <span>
                    {formatDateDMY(turns.date)} -{" "}
                    {String(turns.time).padStart(2, "0")}
                    :00
                  </span>
                </ListGroup.Item>
              ))
            ) : (
              <ListGroup.Item className="service-item d-flex justify-content-center align-items-center">
                No hay turnos este día
              </ListGroup.Item>
            )}
          </ListGroup>
        </div>
      )}

      {!isAdmin && (
        <Container style={{ maxWidth: "350px" }}>
          <h2 className="section-title">Reservar un turno</h2>

          <Calendar
            onChange={(newDate) => {
              setDate(newDate);
            }}
            value={date}
            tileDisabled={tileDisabled}
          />

          <Row className="justify-content-center mt-3">
            <p className="text-center" style={{ color: "#745348" }}>
              Fecha seleccionada: {formatDateDMY(date)}
            </p>
          </Row>

          <Form className="form-container" onSubmit={handleSubmit}>
            <Row className="justify-content-center mt-3">
              <Form.Group controlId="hour-select" className="w-100">
                <Form.Label style={{ color: "#2b211e" }}>
                  Seleccioná un horario:
                </Form.Label>
                <Form.Select
                  className="form-control-custom"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  required
                >
                  <option value="" disabled hidden>
                    Selecciona el horario
                  </option>
                  {availableHours.length > 0 ? (
                    availableHours.map((h) => (
                      <option key={h} value={h}>
                        {h}:00
                      </option>
                    ))
                  ) : (
                    <option disabled>No hay horarios disponibles</option>
                  )}
                </Form.Select>
              </Form.Group>

              <Form.Group controlId="service-select" className="w-100 mt-3">
                <Form.Label style={{ color: "#2b211e" }}>
                  Seleccioná un servicio:
                </Form.Label>
                <Form.Select
                  className="form-control-custom"
                  value={selectedService}
                  onChange={(e) => setSelectedService(e.target.value)}
                  required
                >
                  <option value="" disabled hidden>
                    Seleccioná un servicio
                  </option>
                  {barberservices.map((service) => (
                    <option key={service.id} value={service.id}>
                      {service.serviceType} - ${service.price}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Row>

            <Button
              type="submit"
              className="button-custom mt-3"
              style={{ margin: "25px" }}
            >
              Reservar
            </Button>
          </Form>
        </Container>
      )}
    </div>
  );
}

export default Turn;
