import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function TurnForm() {
  const navigate = useNavigate();
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [barberservices, setBarberservices] = useState([]);
  const [selectedService, setSelectedService] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://localhost:3000/nuestrosservicios")
      .then((res) => res.json())
      .then((data) => setBarberservices(data))
      .catch(() => setError("Error al cargar servicios"));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const token = localStorage.getItem("token");

    if (!token) {
      return setError("No estás logueado");
    }

    try {
      const res = await fetch("http://localhost:3000/turnos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          date,
          time,
          barberserviceId: selectedService,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Error al crear el turno");
      }

      navigate("/mis-turnos");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Reservar un turno</h2>

      {error && <p className="text-red-600">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block">
          Fecha:
          <input
            type="date"
            className="border p-2 w-full"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </label>

        <label className="block">
          Hora:
          <input
            type="time"
            className="border p-2 w-full"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
          />
        </label>

        <label className="block">
          Servicio:
          <select
            className="border p-2 w-full"
            value={selectedService}
            onChange={(e) => setSelectedService(e.target.value)}
            required
          >
            <option value="">Seleccioná un servicio</option>
            {barberservices.map((service) => (
              <option key={service.id} value={service.id}>
                {service.serviceType} - ${service.price}
              </option>
            ))}
          </select>
        </label>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Reservar
        </button>
      </form>
    </div>
  );
}

export default TurnForm;
