import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Myturns = () => {
  const [turnos, setTurnos] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTurnos = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login"); // redirige al login si no hay token
        return;
      }

      try {
        const res = await fetch("http://localhost:3000/turnos", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.message || "Error al obtener los turnos");
        }

        const data = await res.json();
        setTurnos(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTurnos();
  }, [navigate]);

  if (loading) return <p>Cargando turnos...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Mis Turnos</h2>
      {turnos.length === 0 ? (
        <p>No tenés turnos agendados.</p>
      ) : (
        <ul className="space-y-2">
          {turnos.map((turno) => (
            <li
              key={turno.id}
              className="border p-2 rounded shadow flex flex-col sm:flex-row justify-between"
            >
              <span>
                <strong>Servicio:</strong> {turno.serviceType}
              </span>
              <span>
                <strong>Fecha:</strong>{" "}
                {new Date(turno.date).toLocaleDateString()}
              </span>
              <span>
                <strong>Hora:</strong> {turno.time}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Myturns;
