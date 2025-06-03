import { useEffect, useState } from "react";

const Settings = () => {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({ name: "", lastName: "", nroTel: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("No hay token disponible. Iniciá sesión nuevamente.");
        return;
      }

      try {
        const res = await fetch("http://localhost:3000/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Error al obtener el usuario");

        const data = await res.json();
        setUser(data);
        setForm({
          name: data.name,
          lastName: data.lastName,
          nroTel: data.nroTel,
        });
      } catch (err) {
        setError("Error al obtener el usuario.");
      }
    };

    fetchUser();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      const res = await fetch("http://localhost:3000/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Error al actualizar");
      }

      const updatedUser = await res.json();
      setUser(updatedUser);
      setSuccess("Datos actualizados correctamente");
    } catch (err) {
      setError(err.message);
      if (!/^\d{10}$/.test(form.nroTel)) {
        setError("El número de teléfono debe tener exactamente 10 dígitos.");
        return;
      }
    }
  };

  if (error) return <div className="text-red-600">{error}</div>;
  if (!user) return <div>Cargando datos del usuario...</div>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Configuración de cuenta</h2>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block">Nombre:</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className="border p-1 w-full"
          />
        </div>
        <div>
          <label className="block">Apellido:</label>
          <input
            name="lastName"
            value={form.lastName}
            onChange={handleChange}
            className="border p-1 w-full"
          />
        </div>
        <div>
          <label className="block">Teléfono:</label>
          <input
            name="nroTel"
            type="text"
            value={form.nroTel}
            onChange={handleChange}
            className="border p-1 w-full"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Guardar cambios
        </button>

        {success && <p className="text-green-600">{success}</p>}
      </form>
    </div>
  );
};

export default Settings;
