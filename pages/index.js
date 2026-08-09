import { useEffect, useState } from 'react';
import Link from 'next/link';

// URL del backend. En local apunta a localhost:3001, en producción
// se configura en Vercel como variable de entorno apuntando a Render.
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function Home() {
  const [talleres, setTalleres] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/api/talleres`)
      .then((res) => res.json())
      .then((data) => {
        setTalleres(data);
        setCargando(false);
      })
      .catch(() => {
        setError('No se pudo conectar con el servidor. Verifica que el backend esté activo.');
        setCargando(false);
      });
  }, []);

  return (
    <main className="contenedor">
      <h1>Talleres CECyT 9</h1>
      <p className="subtitulo">Selecciona un taller para registrar tu asistencia</p>

      {cargando && <p>Cargando talleres...</p>}
      {error && <p className="error">{error}</p>}

      <div className="grid">
        {talleres.map((taller) => (
          <Link key={taller.id} href={`/talleres/${taller.id}`} className="tarjeta">
            <h2>{taller.nombre}</h2>
            <p>Instructor: {taller.instructor}</p>
            <p>Fecha: {taller.fecha}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
