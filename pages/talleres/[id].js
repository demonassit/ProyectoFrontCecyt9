import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function DetalleTaller() {
  const router = useRouter();
  const { id } = router.query;

  const [taller, setTaller] = useState(null);
  const [asistencias, setAsistencias] = useState([]);
  const [nombreAlumno, setNombreAlumno] = useState('');
  const [boleta, setBoleta] = useState('');
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    if (!id) return;
    cargarDatos();
  }, [id]);

  async function cargarDatos() {
    const resTaller = await fetch(`${API_URL}/api/talleres/${id}`);
    const dataTaller = await resTaller.json();
    setTaller(dataTaller);

    const resAsistencias = await fetch(`${API_URL}/api/talleres/${id}/asistencias`);
    const dataAsistencias = await resAsistencias.json();
    setAsistencias(dataAsistencias);
  }

  async function registrarAsistencia(e) {
    e.preventDefault();
    setMensaje('');

    const res = await fetch(`${API_URL}/api/asistencias`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ taller_id: id, nombre_alumno: nombreAlumno, boleta }),
    });

    if (res.ok) {
      setMensaje('Asistencia registrada correctamente');
      setNombreAlumno('');
      setBoleta('');
      cargarDatos();
    } else {
      const data = await res.json();
      setMensaje(`Error: ${data.error}`);
    }
  }

  if (!taller) {
    return (
      <main className="contenedor">
        <p>Cargando...</p>
      </main>
    );
  }

  return (
    <main className="contenedor">
      <h1>{taller.nombre}</h1>
      <p>Instructor: {taller.instructor}</p>
      <p>Fecha: {taller.fecha}</p>
      <p>Asistentes registrados: {taller.asistentes} / {taller.cupo}</p>

      <form onSubmit={registrarAsistencia} className="formulario">
        <h2>Registrar asistencia</h2>
        <input
          type="text"
          placeholder="Nombre completo"
          value={nombreAlumno}
          onChange={(e) => setNombreAlumno(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Boleta"
          value={boleta}
          onChange={(e) => setBoleta(e.target.value)}
          required
        />
        <button type="submit">Registrar</button>
      </form>

      {mensaje && <p className="mensaje">{mensaje}</p>}

      <h2>Alumnos registrados</h2>
      <ul>
        {asistencias.map((a) => (
          <li key={a.id}>
            {a.nombre_alumno} — Boleta: {a.boleta}
          </li>
        ))}
      </ul>
    </main>
  );
}
