import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function DetalleTaller() {
  const router = useRouter();
  const { id } = router.query;

  const [taller, setTaller] = useState(null);
  const [asistencias, setAsistencias] = useState([]);
  const [errorAsistencias, setErrorAsistencias] = useState(null);
  const [nombreAlumno, setNombreAlumno] = useState('');
  const [boleta, setBoleta] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [registroOk, setRegistroOk] = useState(false);

  useEffect(() => {
    if (!id) return;
    cargarDatos();
  }, [id]);

  async function cargarDatos() {
    const resTaller = await fetch(`${API_URL}/api/talleres/${id}`);
    const dataTaller = await resTaller.json();
    setTaller(dataTaller);

    // La lista con nombres y boletas solo la ve el administrador (requiere sesión)
    const resAsistencias = await fetch(`${API_URL}/api/talleres/${id}/asistencias`, { credentials: 'include' });
    const dataAsistencias = await resAsistencias.json();

    if (resAsistencias.ok) {
      setAsistencias(dataAsistencias);
      setErrorAsistencias(null);
    } else if (resAsistencias.status === 401 || resAsistencias.status === 403) {
      setAsistencias(null);
      setErrorAsistencias(null);
    } else {
      setErrorAsistencias(dataAsistencias.error || 'No se pudo cargar la lista de asistentes');
    }
  }

  async function registrarAsistencia(e) {
    e.preventDefault();
    setMensaje('');

    const res = await fetch(`${API_URL}/api/asistencias`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ taller_id: id, nombre_alumno: nombreAlumno, boleta }),
    });

    setRegistroOk(res.ok);
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

  const cupoLleno = taller.cupo != null && taller.asistentes >= taller.cupo;

  return (
    <main className="contenedor">
      <h1>{taller.nombre}</h1>
      <p>Instructor: {taller.instructor}</p>
      <p>Fecha: {taller.fecha}</p>
      <p>Asistentes registrados: {taller.asistentes} / {taller.cupo}</p>

      {cupoLleno ? (
        <p className="error">Este taller ya no tiene cupo disponible.</p>
      ) : (
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
            placeholder="Boleta (10 dígitos)"
            inputMode="numeric"
            pattern="\d{10}"
            maxLength={10}
            title="La boleta debe tener exactamente 10 dígitos"
            value={boleta}
            onChange={(e) => setBoleta(e.target.value)}
            required
          />
          <button type="submit">Registrar</button>
        </form>
      )}

      {mensaje && <p className={registroOk ? 'mensaje' : 'error'}>{mensaje}</p>}

      {asistencias !== null && <h2>Alumnos registrados</h2>}
      {errorAsistencias ? (
        <p className="error">{errorAsistencias}</p>
      ) : asistencias !== null && (
        <ul>
          {asistencias.map((a) => (
            <li key={a.id}>
              {a.nombre_alumno} — Boleta: {a.boleta}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
