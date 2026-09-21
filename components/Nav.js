import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function Nav() {
  const router = useRouter();
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    cargarSesion();
  }, [router.asPath]);

  async function cargarSesion() {
    try {
      const res = await fetch(`${API_URL}/api/auth/me`, { credentials: 'include' });
      const data = await res.json();
      setUsuario(data.usuario);
    } catch {
      setUsuario(null);
    } finally {
      setCargando(false);
    }
  }

  async function cerrarSesion() {
    await fetch(`${API_URL}/api/auth/logout`, { method: 'POST', credentials: 'include' });
    setUsuario(null);
    router.push('/');
  }

  if (cargando) return null;

  return (
    <nav className="nav">
      <Link href="/">Talleres</Link>
      {usuario?.rol === 'admin' ? (
        <>
          <Link href="/admin/talleres">Panel de administrador</Link>
          <button onClick={cerrarSesion}>Cerrar sesión ({usuario.nombre})</button>
        </>
      ) : (
        <Link href="/login">Iniciar sesión</Link>
      )}
    </nav>
  );
}
