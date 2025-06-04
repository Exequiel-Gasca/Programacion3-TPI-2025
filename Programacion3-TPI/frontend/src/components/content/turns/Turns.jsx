import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "react-calendar/dist/Calendar.css";
import "./Turns.css";
import Calendar from "react-calendar";
import { Form, Container, Row, ListGroup } from "react-bootstrap";

function Turn() {
  const navigate = useNavigate();
  const [barberservices, setBarberservices] = useState([]);
  const [selectedService, setSelectedService] = useState("");
  const [turnos, setTurnos] = useState([]);
  const [error, setError] = useState("");
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

  useEffect(() => {
    fetch("http://localhost:3000/nuestrosservicios")
      .then((res) => res.json())
      .then((data) => setBarberservices(data))
      .catch(() => setError("Error al cargar servicios"));
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
          setError(data.message || "Error al obtener turnos");
          return;
        }

        const data = await response.json();
        setTurnos(Array.isArray(data) ? data : []);
      } catch (err) {
        setError("No se pudo conectar con el servidor");
      }
    };

    if (token) obtenerTurnos();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!token) {
      return setError("No estás logueado");
    }

    if (!selectedService) {
      return setError("Seleccioná un servicio");
    }

    if (!time) {
      return setError("Seleccioná un horario");
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
        throw new Error(data.message || "Error al crear el turno");
      }

      setTime("");
      setSelectedService("");
      setError("");

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
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      {isAdmin && (
        <div className="d-flex flex-column align-items-center justify-content-center text-center">
          <h2 className="section-title">Turnos por Día</h2>

          <Calendar
            onChange={(newDate) => {
              setDate(newDate);
              setTime("");
            }}
            value={date}
            tileDisabled={({ date }) => date.getDay() === 0}
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
              <ListGroup.Item className="text-center">
                No hay turnos ese día
              </ListGroup.Item>
            )}
          </ListGroup>
        </div>
      )}

      {!isAdmin && (
        <Container style={{ maxWidth: "350px", marginTop: "2rem" }}>
          <h2 className="text-xl font-bold mb-4">Reservar un turno</h2>

          {error && <p className="text-danger">{error}</p>}

          <Row className="justify-content-center">
            <Calendar
              onChange={(newDate) => {
                setDate(newDate);
                setTime("");
              }}
              value={date}
              tileDisabled={({ date }) => date.getDay() === 0}
            />
          </Row>

          <Row className="justify-content-center mt-3">
            <p className="text-center">
              Fecha seleccionada: {formatDateDMY(date)}
            </p>
          </Row>

          <Row className="justify-content-center mt-3">
            <Form.Group controlId="hour-select" className="w-100">
              <Form.Label>Seleccioná un horario:</Form.Label>
              <Form.Select
                value={time}
                onChange={(e) => setTime(e.target.value)}
              >
                <option value="" disabled>
                  Selecciona el horario
                </option>
                {hours.map((h) => (
                  <option key={h} value={h}>
                    {h}:00
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group controlId="service-select" className="w-100 mt-3">
              <Form.Label>Seleccioná un servicio:</Form.Label>
              <Form.Select
                value={selectedService}
                onChange={(e) => setSelectedService(e.target.value)}
              >
                <option value="">Seleccioná un servicio</option>
                {barberservices.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.serviceType} - ${service.price}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Row>

          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded mt-3"
            onClick={handleSubmit}
          >
            Reservar
          </button>
        </Container>
      )}
    </div>
  );
}

export default Turn;
