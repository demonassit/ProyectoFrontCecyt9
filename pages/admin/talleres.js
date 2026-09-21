import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function AdminTalleres() {
  const router = useRouter();
  const [autorizado, setAutorizado] = useState(null);
  const [talleres, setTalleres] = useState([]);
  const [nombre, setNombre] = useState('');
  const [instructor, setInstructor] = useState('');
  const [fecha, setFecha] = useState('');
  const [cupo, setCupo] = useState('');
  const [editandoId, setEditandoId] = useState(null);
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    verificarSesion();
  }, []);

  async function verificarSesion() {
    const res = await fetch(`${API_URL}/api/auth/me`, { credentials: 'include' });
    const data = await res.json();

    if (data.usuario?.rol !== 'admin') {
      router.push('/login');
      return;
    }

    setAutorizado(true);
    cargarTalleres();
  }

  async function cargarTalleres() {
    const res = await fetch(`${API_URL}/api/talleres`);
    const data = await res.json();
    setTalleres(data);
  }

  async function crearTaller(e) {
    e.preventDefault();
    setMensaje('');

    const res = await fetch(`${API_URL}/api/talleres`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ nombre, instructor, fecha, cupo: cupo ? Number(cupo) : undefined }),
    });

    if (res.ok) {
      setNombre('');
      setInstructor('');
      setFecha('');
      setCupo('');
      cargarTalleres();
    } else {
      const data = await res.json();
      setMensaje(`Error: ${data.error}`);
    }
  }

  async function eliminarTaller(id) {
    const res = await fetch(`${API_URL}/api/talleres/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });

    if (res.ok) {
      cargarTalleres();
    } else {
      const data = await res.json();
      setMensaje(`Error: ${data.error}`);
    }
  }

  async function guardarEdicion(taller) {
    const res = await fetch(`${API_URL}/api/talleres/${taller.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(taller),
    });

    if (res.ok) {
      setEditandoId(null);
      cargarTalleres();
    } else {
      const data = await res.json();
      setMensaje(`Error: ${data.error}`);
    }
  }

  if (!autorizado) {
    return (
      <main className="contenedor">
        <p>Verificando sesión...</p>
      </main>
    );
  }

  return (
    <main className="contenedor">
      <h1>Administración de cursos</h1>

      <form onSubmit={crearTaller} className="formulario">
        <h2>Publicar curso</h2>
        <input placeholder="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
        <input placeholder="Instructor" value={instructor} onChange={(e) => setInstructor(e.target.value)} />
        <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} required />
        <input type="number" placeholder="Cupo" value={cupo} onChange={(e) => setCupo(e.target.value)} />
        <button type="submit">Publicar</button>
      </form>

      {mensaje && <p className="error">{mensaje}</p>}

      <h2>Cursos existentes</h2>
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Instructor</th>
            <th>Fecha</th>
            <th>Cupo</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {talleres.map((t) => (
            <tr key={t.id}>
              {editandoId === t.id ? (
                <FilaEdicion taller={t} onGuardar={guardarEdicion} onCancelar={() => setEditandoId(null)} />
              ) : (
                <>
                  <td>{t.nombre}</td>
                  <td>{t.instructor}</td>
                  <td>{t.fecha}</td>
                  <td>{t.cupo}</td>
                  <td>
                    <button onClick={() => setEditandoId(t.id)}>Editar</button>
                    <button onClick={() => eliminarTaller(t.id)}>Eliminar</button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}

function FilaEdicion({ taller, onGuardar, onCancelar }) {
  const [nombre, setNombre] = useState(taller.nombre);
  const [instructor, setInstructor] = useState(taller.instructor || '');
  const [fecha, setFecha] = useState(taller.fecha);
  const [cupo, setCupo] = useState(taller.cupo);

  return (
    <>
      <td><input value={nombre} onChange={(e) => setNombre(e.target.value)} /></td>
      <td><input value={instructor} onChange={(e) => setInstructor(e.target.value)} /></td>
      <td><input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} /></td>
      <td><input type="number" value={cupo} onChange={(e) => setCupo(Number(e.target.value))} /></td>
      <td>
        <button onClick={() => onGuardar({ id: taller.id, nombre, instructor, fecha, cupo })}>Guardar</button>
        <button onClick={onCancelar}>Cancelar</button>
      </td>
    </>
  );
}
