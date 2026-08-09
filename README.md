# Frontend - Registro de Asistencia CECyT 9

Aplicación Next.js que consume la API del backend para mostrar los talleres
disponibles y registrar la asistencia de los alumnos.

## Estructura

```
pages/index.js            -> lista de talleres
pages/talleres/[id].js    -> detalle de un taller + formulario de registro
styles/globals.css        -> estilos
.env.local.example        -> variable con la URL del backend
```

## Cómo correrlo en tu computadora

1. Instala las dependencias:
   ```
   npm install
   ```
2. Copia `.env.local.example` a `.env.local`. Si el backend corre en tu
   máquina, deja el valor tal cual (`http://localhost:3001`).
3. Levanta el proyecto:
   ```
   npm run dev
   ```
4. Abre `http://localhost:3000` en el navegador.

## Cómo desplegarlo en Vercel (gratis)

1. Sube este proyecto a un repositorio de GitHub (diferente al del backend).
2. En vercel.com, importa ese repositorio como nuevo proyecto. Vercel
   detecta automáticamente que es Next.js, no requiere configuración extra.
3. En "Environment Variables", agrega:
   - `NEXT_PUBLIC_API_URL` con la URL pública de tu backend en Render
     (por ejemplo `https://cecyt9-asistencia-backend.onrender.com`).
4. Da clic en "Deploy". Cada vez que se haga push a la rama principal del
   repositorio, Vercel volverá a desplegar automáticamente.

## Cosas importantes para explicar en clase

- La variable `NEXT_PUBLIC_API_URL` empieza con `NEXT_PUBLIC_` a propósito:
  en Next.js, solo las variables con ese prefijo quedan disponibles en el
  navegador. Es un buen momento para hablar de qué código corre en el
  servidor y cuál corre en el cliente.
- El frontend nunca se conecta directamente a Supabase: siempre pasa por
  el backend. Las credenciales de la base de datos jamás deben estar en
  este proyecto.
