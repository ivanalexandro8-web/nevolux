/* =========================================================
   NEVOLUX — cliente de API
   Endpoints verificados contra authRoutes, estudianteRoutes,
   asesorRoutes, solicitudRoutes, chatRoutes, asesoriaRoutes,
   examenRoutes, materiaRoutes, adminRoutes y quejaRoutes.
   ========================================================= */

const API_BASE = window.location.origin.includes("localhost") || window.location.origin.includes("127.0.0.1")
  ? "http://localhost:4000/api"
  : "/api";

const ENDPOINTS = {
  // auth
  login: "/auth/login",
  registroEstudiante: "/auth/registro/estudiante",
  registroAsesor: "/auth/registro/asesor",

  // materias
  materias: "/materias",

  // estudiante
  perfilEstudiante: "/estudiantes/perfil",
  passwordEstudiante: "/estudiantes/password",
  buscarAsesores: (materiaId) => `/estudiantes/asesores/${materiaId}`,
  fotoEstudiante: "/estudiantes/foto",

  // asesor
  perfilAsesor: "/asesores/perfil",
  passwordAsesor: "/asesores/password",
  horarios: "/asesores/horarios",
  horarioId: (id) => `/asesores/horarios/${id}`,
  segundaMateria: "/asesores/segunda-materia",
  fotoAsesor: "/asesores/foto",

  // solicitudes
  crearSolicitud: "/solicitudes",
  misSolicitudesEstudiante: "/solicitudes/estudiante",
  misSolicitudesAsesor: "/solicitudes/asesor",
  responderSolicitud: (id) => `/solicitudes/${id}/responder`,
  cancelarSolicitud: (id) => `/solicitudes/${id}/cancelar`,

  // asesorías activas
  finalizarAsesoria: (solicitudId) => `/asesorias/${solicitudId}/finalizar`,

  // chat
  chatMensajes: (solicitudId) => `/chat/${solicitudId}/mensajes`,

  // examen (certificación de asesor)
  examenIniciar: "/examenes/iniciar",
  examenResponder: "/examenes/responder",

  // quejas y sugerencias
  quejas: "/quejas",
  responderQueja: (id) => `/quejas/${id}/responder`,

  // admin
  adminEstudiantes: "/admin/estudiantes",
  adminAsesores: "/admin/asesores",
  adminEliminarCuenta: (id) => `/admin/cuentas/${id}`,
  adminRestablecerPassword: (id) => `/admin/cuentas/${id}/password`,
  adminRevisarAsesorMateria: (asesorMateriaId) => `/admin/asesor-materia/${asesorMateriaId}/revisar`,
};

function getSession() {
  try {
    return JSON.parse(localStorage.getItem("nevolux_session") || "null");
  } catch {
    return null;
  }
}

function setSession(session) {
  localStorage.setItem("nevolux_session", JSON.stringify(session));
}

function clearSession() {
  localStorage.removeItem("nevolux_session");
}

/** Decodifica el payload de un JWT (sin verificar firma) solo para leer datos como rol/nombre/id. */
function decodeJwtPayload(token) {
  try {
    const payload = token.split(".")[1];
    const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(decodeURIComponent(escape(json)));
  } catch {
    return {};
  }
}

/**
 * Llama a la API. path es una ruta relativa a /api, por ejemplo "/materias".
 */
async function apiFetch(path, { method = "GET", body, auth = true } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (auth) {
    const session = getSession();
    if (session && session.token) headers["Authorization"] = `Bearer ${session.token}`;
  }

  let res;
  try {
    res = await fetch(`${API_BASE}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch (err) {
    throw new Error("No se pudo conectar con el servidor. ¿Está corriendo el backend?");
  }

  const isJson = res.headers.get("content-type")?.includes("application/json");
  const data = isJson ? await res.json().catch(() => ({})) : null;

  if (res.status === 401) {
    clearSession();
    window.location.href = "/index.html";
    throw new Error("Sesión expirada");
  }

  if (!res.ok) {
    throw new Error((data && (data.mensaje || data.message || data.error)) || `Error ${res.status}`);
  }

  return data;
}

/** Protege una página de dashboard: redirige si no hay sesión o el rol no coincide. */
function requireRole(rolEsperado) {
  const session = getSession();
  if (!session || !session.token) {
    window.location.href = "/index.html";
    return null;
  }
  if (rolEsperado && session.rol !== rolEsperado) {
    window.location.href = `/dashboard-${session.rol}.html`;
    return null;
  }
  return session;
}

function logout() {
  clearSession();
  window.location.href = "/index.html";
}
