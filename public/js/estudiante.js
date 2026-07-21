const session = requireRole("estudiante");
if (session) document.getElementById("session-nombre").textContent = session.nombre || "Estudiante";

// ---------- navegación ----------
const views = ["solicitar", "mis-solicitudes", "chat", "quejas"];
document.querySelectorAll(".nav-item").forEach((item) => {
  item.addEventListener("click", () => {
    document.querySelectorAll(".nav-item").forEach((i) => i.classList.remove("active"));
    item.classList.add("active");
    views.forEach((v) => document.getElementById(`view-${v}`).classList.add("hidden"));
    document.getElementById(`view-${item.dataset.view}`).classList.remove("hidden");
    if (item.dataset.view === "mis-solicitudes") cargarSolicitudes();
    if (item.dataset.view === "chat") cargarConversaciones();
  });
});

// ---------- paso 1: materias ----------
async function cargarMaterias() {
  const select = document.getElementById("select-materia");
  try {
    const materias = await apiFetch(ENDPOINTS.materias);
    const lista = Array.isArray(materias) ? materias : materias.materias || [];
    select.innerHTML =
      `<option value="">Selecciona una materia...</option>` +
      lista.map((m) => `<option value="${m.id}">${m.nombre}</option>`).join("");
    select.onchange = () => cargarAsesoresDeMateria(select.value);
  } catch (err) {
    select.innerHTML = `<option>${err.message}</option>`;
  }
}

// ---------- paso 2: asesores aprobados de esa materia ----------
async function cargarAsesoresDeMateria(materiaId) {
  const tbody = document.querySelector("#tabla-asesores tbody");
  const empty = document.getElementById("asesores-empty");
  tbody.innerHTML = "";
  if (!materiaId) {
    empty.textContent = "Selecciona una materia para ver a sus asesores.";
    empty.classList.remove("hidden");
    return;
  }
  try {
    const asesores = await apiFetch(ENDPOINTS.buscarAsesores(materiaId));
    const lista = Array.isArray(asesores) ? asesores : asesores.asesores || [];
    if (lista.length === 0) {
      empty.textContent = "Todavía no hay asesores aprobados para esta materia.";
      empty.classList.remove("hidden");
      return;
    }
    empty.classList.add("hidden");
    lista.forEach((a) => {
      const tr = document.createElement("tr");
      const nombreCompleto = [a.nombre, a.apellido_paterno, a.apellido_materno].filter(Boolean).join(" ");
      tr.innerHTML = `<td>${nombreCompleto || a.nombre}</td>
        <td style="color:var(--text-muted); font-size:0.85rem;">${a.curriculum ?? "—"}</td>
        <td><button class="btn btn-primary" style="padding:0.4rem 0.9rem; font-size:0.82rem;"
            onclick="solicitarAsesor(${a.id}, ${materiaId})">Solicitar</button></td>`;
      tbody.appendChild(tr);
    });
  } catch (err) {
    empty.textContent = err.message;
    empty.classList.remove("hidden");
  }
}

async function solicitarAsesor(asesorId, materiaId) {
  try {
    await apiFetch(ENDPOINTS.crearSolicitud, {
      method: "POST",
      body: { asesor_id: asesorId, materia_id: parseInt(materiaId, 10) },
    });
    alert("Solicitud enviada. Revisa 'Mis solicitudes' para ver el estado.");
  } catch (err) {
    alert(err.message);
  }
}

// ---------- mis solicitudes ----------
async function cargarSolicitudes() {
  const tbody = document.querySelector("#tabla-solicitudes tbody");
  const empty = document.getElementById("solicitudes-empty");
  try {
    const solicitudes = await apiFetch(ENDPOINTS.misSolicitudesEstudiante);
    const lista = Array.isArray(solicitudes) ? solicitudes : solicitudes.solicitudes || [];
    tbody.innerHTML = "";
    if (lista.length === 0) {
      empty.classList.remove("hidden");
      return;
    }
    empty.classList.add("hidden");
    lista.forEach((s) => {
      const estado = s.estado ?? (s.aceptar === true ? "aceptada" : s.aceptar === false ? "rechazada" : "pendiente");
      const badgeClass = estado === "aceptada" ? "badge-ok" : estado === "rechazada" || estado === "cancelada" ? "badge-block" : "badge-pending";
      const cancelable = estado === "pendiente" || estado === "aceptada";
      const tr = document.createElement("tr");
      tr.innerHTML = `<td>${s.materia?.nombre ?? s.materia_id ?? "—"}</td>
        <td>${s.asesor?.nombre ?? "—"}</td>
        <td><span class="badge ${badgeClass}">${estado}</span></td>
        <td>${cancelable ? `<button class="btn btn-ghost" style="padding:0.35rem 0.8rem; font-size:0.8rem;" onclick="cancelarSolicitud(${s.id})">Cancelar</button>` : ""}</td>`;
      tbody.appendChild(tr);
    });
  } catch (err) {
    empty.textContent = err.message;
    empty.classList.remove("hidden");
  }
}

async function cancelarSolicitud(id) {
  if (!confirm("¿Cancelar esta solicitud?")) return;
  try {
    await apiFetch(ENDPOINTS.cancelarSolicitud(id), { method: "PUT" });
    cargarSolicitudes();
  } catch (err) {
    alert(err.message);
  }
}

// ---------- chat ----------
let chatActivo = null;
let chatPolling = null;

async function cargarConversaciones() {
  const select = document.getElementById("select-chat");
  const empty = document.getElementById("chat-empty");
  const box = document.getElementById("chat-box");
  const btnFinalizar = document.getElementById("btn-finalizar-asesoria");
  try {
    const solicitudes = await apiFetch(ENDPOINTS.misSolicitudesEstudiante);
    const lista = (Array.isArray(solicitudes) ? solicitudes : solicitudes.solicitudes || []).filter(
      (s) => (s.estado ?? (s.aceptar === true ? "aceptada" : "")) === "aceptada"
    );
    if (lista.length === 0) {
      empty.classList.remove("hidden");
      box.classList.add("hidden");
      select.classList.add("hidden");
      btnFinalizar.classList.add("hidden");
      return;
    }
    empty.classList.add("hidden");
    box.classList.remove("hidden");
    select.classList.remove("hidden");
    btnFinalizar.classList.remove("hidden");
    select.innerHTML = lista
      .map((s) => `<option value="${s.id}">${s.materia?.nombre ?? s.materia_id} — ${s.asesor?.nombre ?? ""}</option>`)
      .join("");
    chatActivo = lista[0].id;
    abrirChat(chatActivo);
    select.onchange = () => {
      chatActivo = select.value;
      abrirChat(chatActivo);
    };
  } catch (err) {
    empty.textContent = err.message;
    empty.classList.remove("hidden");
  }
}

async function abrirChat(solicitudId) {
  if (chatPolling) clearInterval(chatPolling);
  await refrescarMensajes(solicitudId);
  chatPolling = setInterval(() => refrescarMensajes(solicitudId), 4000);
}

async function refrescarMensajes(solicitudId) {
  const cont = document.getElementById("chat-messages");
  try {
    const mensajes = await apiFetch(ENDPOINTS.chatMensajes(solicitudId));
    const lista = Array.isArray(mensajes) ? mensajes : mensajes.mensajes || [];
    cont.innerHTML = lista
      .map((m) => `<div class="chat-msg ${m.emisor_id === session.id ? "mine" : "theirs"}">${m.texto}</div>`)
      .join("");
    cont.scrollTop = cont.scrollHeight;
  } catch (err) {
    console.warn(err.message);
  }
}

document.getElementById("chat-enviar").addEventListener("click", async () => {
  const input = document.getElementById("chat-input");
  const texto = input.value.trim();
  if (!texto || !chatActivo) return;
  input.value = "";
  try {
    await apiFetch(ENDPOINTS.chatMensajes(chatActivo), { method: "POST", body: { texto } });
    refrescarMensajes(chatActivo);
  } catch (err) {
    alert(err.message);
  }
});

document.getElementById("btn-finalizar-asesoria").addEventListener("click", async () => {
  if (!chatActivo) return;
  if (!confirm("¿Dar por finalizada esta asesoría?")) return;
  try {
    await apiFetch(ENDPOINTS.finalizarAsesoria(chatActivo), { method: "PUT" });
    alert("Asesoría finalizada.");
    cargarConversaciones();
  } catch (err) {
    alert(err.message);
  }
});

// ---------- quejas y sugerencias ----------
document.getElementById("btn-enviar-queja").addEventListener("click", async () => {
  const msg = document.getElementById("queja-msg");
  const mensaje = document.getElementById("queja-mensaje").value.trim();
  if (!mensaje) return;
  try {
    await apiFetch(ENDPOINTS.quejas, {
      method: "POST",
      body: { tipo: document.getElementById("queja-tipo").value, mensaje },
    });
    msg.textContent = "Enviado. El administrador lo revisará pronto.";
    msg.className = "form-msg show ok";
    document.getElementById("queja-mensaje").value = "";
  } catch (err) {
    msg.textContent = err.message;
    msg.className = "form-msg show error";
  }
});

cargarMaterias();
