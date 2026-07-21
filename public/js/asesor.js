const session = requireRole("asesor");
if (session) document.getElementById("session-nombre").textContent = session.nombre || "Asesor";

// ---------- navegación ----------
const views = ["solicitudes", "materias", "horarios", "examen", "chat", "quejas"];
document.querySelectorAll(".nav-item").forEach((item) => {
  item.addEventListener("click", () => {
    document.querySelectorAll(".nav-item").forEach((i) => i.classList.remove("active"));
    item.classList.add("active");
    views.forEach((v) => document.getElementById(`view-${v}`).classList.add("hidden"));
    document.getElementById(`view-${item.dataset.view}`).classList.remove("hidden");
    if (item.dataset.view === "materias") cargarPerfil();
    if (item.dataset.view === "horarios") cargarHorarios();
    if (item.dataset.view === "examen") cargarMateriasExamen();
    if (item.dataset.view === "chat") cargarConversaciones();
  });
});

// ---------- solicitudes recibidas ----------
async function cargarSolicitudes() {
  const tbody = document.querySelector("#tabla-solicitudes tbody");
  const empty = document.getElementById("solicitudes-empty");
  try {
    const solicitudes = await apiFetch(ENDPOINTS.misSolicitudesAsesor);
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
      const tr = document.createElement("tr");
      const acciones =
        estado === "pendiente"
          ? `<button class="btn btn-primary" style="padding:0.35rem 0.8rem; font-size:0.8rem;" onclick="responder(${s.id}, true)">Aceptar</button>
             <button class="btn btn-danger" style="padding:0.35rem 0.8rem; font-size:0.8rem; margin-left:0.4rem;" onclick="responder(${s.id}, false)">Rechazar</button>`
          : estado === "aceptada"
          ? `<button class="btn btn-ghost" style="padding:0.35rem 0.8rem; font-size:0.8rem;" onclick="cancelarSolicitud(${s.id})">Cancelar</button>`
          : "";
      tr.innerHTML = `<td>${s.estudiante?.nombre ?? "—"}</td>
        <td>${s.materia?.nombre ?? s.materia_id ?? "—"}</td>
        <td><span class="badge ${badgeClass}">${estado}</span></td>
        <td>${acciones}</td>`;
      tbody.appendChild(tr);
    });
  } catch (err) {
    empty.textContent = err.message;
    empty.classList.remove("hidden");
  }
}

async function responder(solicitudId, aceptar) {
  try {
    await apiFetch(ENDPOINTS.responderSolicitud(solicitudId), { method: "PUT", body: { aceptar } });
    cargarSolicitudes();
  } catch (err) {
    alert(err.message);
  }
}

async function cancelarSolicitud(id) {
  if (!confirm("¿Cancelar esta asesoría?")) return;
  try {
    await apiFetch(ENDPOINTS.cancelarSolicitud(id), { method: "PUT" });
    cargarSolicitudes();
  } catch (err) {
    alert(err.message);
  }
}

// ---------- mi perfil / materias ----------
async function cargarPerfil() {
  const cont = document.getElementById("perfil-card");
  const segundaCard = document.getElementById("segunda-materia-card");
  try {
    const perfil = await apiFetch(ENDPOINTS.perfilAsesor);
    const materias = perfil.materias || [];
    cont.innerHTML = `
      <span class="eyebrow">Currículum</span>
      <p style="margin-top:0.4rem;">${perfil.curriculum ?? "—"}</p>
      <span class="eyebrow" style="margin-top:1rem; display:block;">Materias</span>
      ${
        materias.length
          ? `<ul style="margin-top:0.4rem;">${materias
              .map((m) => `<li>${m.nombre ?? m} ${m.aprobado === false ? '<span class="badge badge-pending">en revisión</span>' : ""}</li>`)
              .join("")}</ul>`
          : `<p style="color:var(--text-muted); margin-top:0.4rem;">Aún no tienes materias asignadas.</p>`
      }`;
    segundaCard.style.display = materias.length >= 2 ? "none" : "block";
    if (materias.length < 2) cargarMateriasParaSegunda();
  } catch (err) {
    cont.innerHTML = `<div class="empty-state">${err.message}</div>`;
  }
}

async function cargarMateriasParaSegunda() {
  const select = document.getElementById("select-segunda-materia");
  try {
    const materias = await apiFetch(ENDPOINTS.materias);
    const lista = Array.isArray(materias) ? materias : materias.materias || [];
    select.innerHTML = lista.map((m) => `<option value="${m.id}">${m.nombre}</option>`).join("");
  } catch (err) {
    select.innerHTML = `<option>${err.message}</option>`;
  }
}

document.getElementById("btn-segunda-materia").addEventListener("click", async () => {
  const select = document.getElementById("select-segunda-materia");
  const msg = document.getElementById("segunda-materia-msg");
  if (!select.value) return;
  try {
    await apiFetch(ENDPOINTS.segundaMateria, { method: "POST", body: { materia_id: parseInt(select.value, 10) } });
    msg.textContent = "Postulación enviada. El administrador la revisará.";
    msg.className = "form-msg show ok";
    cargarPerfil();
  } catch (err) {
    msg.textContent = err.message;
    msg.className = "form-msg show error";
  }
});

// ---------- horarios ----------
async function cargarHorarios() {
  const tbody = document.querySelector("#tabla-horarios tbody");
  const empty = document.getElementById("horarios-empty");
  try {
    const perfil = await apiFetch(ENDPOINTS.perfilAsesor);
    const lista = perfil.horarios || [];
    tbody.innerHTML = "";
    if (lista.length === 0) {
      empty.classList.remove("hidden");
      return;
    }
    empty.classList.add("hidden");
    lista.forEach((h) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `<td>${h.dia_semana}</td><td>${h.hora_inicio}</td><td>${h.hora_fin}</td>
        <td><button class="btn btn-danger" style="padding:0.3rem 0.7rem; font-size:0.78rem;" onclick="eliminarHorario(${h.id})">Eliminar</button></td>`;
      tbody.appendChild(tr);
    });
  } catch (err) {
    empty.textContent = err.message;
    empty.classList.remove("hidden");
  }
}

document.getElementById("btn-agregar-horario").addEventListener("click", async () => {
  const msg = document.getElementById("horario-msg");
  const dia_semana = document.getElementById("h-dia").value;
  const hora_inicio = document.getElementById("h-inicio").value;
  const hora_fin = document.getElementById("h-fin").value;
  if (!hora_inicio || !hora_fin) {
    msg.textContent = "Indica hora de inicio y fin.";
    msg.className = "form-msg show error";
    return;
  }
  try {
    await apiFetch(ENDPOINTS.horarios, { method: "POST", body: { dia_semana, hora_inicio, hora_fin } });
    msg.textContent = "Horario agregado.";
    msg.className = "form-msg show ok";
    cargarHorarios();
  } catch (err) {
    msg.textContent = err.message;
    msg.className = "form-msg show error";
  }
});

async function eliminarHorario(id) {
  try {
    await apiFetch(ENDPOINTS.horarioId(id), { method: "DELETE" });
    cargarHorarios();
  } catch (err) {
    alert(err.message);
  }
}

// ---------- examen de certificación ----------
let examenMateriaActual = null;
let examenIdActual = null;
let examenFechaInicio = null;
let examenTimerInterval = null;
let examenSegundosRestantes = 600;

async function cargarMateriasExamen() {
  const select = document.getElementById("examen-materia");
  try {
    const perfil = await apiFetch(ENDPOINTS.perfilAsesor);
    const materias = perfil.materias || [];
    if (materias.length === 0) {
      select.innerHTML = `<option value="">Aún no tienes materias postuladas</option>`;
      return;
    }
    select.innerHTML = materias.map((m) => `<option value="${m.id ?? m.materia_id}">${m.nombre ?? m}</option>`).join("");
  } catch (err) {
    select.innerHTML = `<option>${err.message}</option>`;
  }
}

document.getElementById("btn-iniciar-examen").addEventListener("click", async () => {
  const materiaId = document.getElementById("examen-materia").value;
  if (!materiaId) return;
  examenMateriaActual = materiaId;
  try {
    const data = await apiFetch(ENDPOINTS.examenIniciar, { method: "POST", body: { materia_id: parseInt(materiaId, 10) } });
    examenIdActual = data.examen_id ?? data.id;
    examenFechaInicio = data.fecha_inicio ?? new Date().toISOString();
    const preguntas = data.preguntas || [];
    renderPreguntas(preguntas);
    document.getElementById("examen-intro").classList.add("hidden");
    document.getElementById("examen-form").classList.remove("hidden");
    document.getElementById("examen-timer").classList.remove("hidden");
    iniciarTimer(600);
  } catch (err) {
    alert(err.message);
  }
});

const LETRAS = ["A", "B", "C", "D", "E", "F"];

function renderPreguntas(preguntas) {
  const cont = document.getElementById("examen-preguntas");
  cont.innerHTML = preguntas
    .map(
      (p, i) => `
      <div class="question-block">
        <strong>${i + 1}. ${p.enunciado ?? p.pregunta}</strong>
        <div style="margin-top:0.6rem;">
          ${(p.opciones || [])
            .map(
              (op, j) => `
            <label class="option-row">
              <input type="radio" name="pregunta-${p.id ?? p.pregunta_id}" value="${LETRAS[j]}" required />
              ${LETRAS[j]}. ${op.texto ?? op}
            </label>`
            )
            .join("")}
        </div>
      </div>`
    )
    .join("");
}

function iniciarTimer(segundos) {
  examenSegundosRestantes = segundos;
  const el = document.getElementById("examen-timer");
  clearInterval(examenTimerInterval);
  examenTimerInterval = setInterval(() => {
    examenSegundosRestantes--;
    const m = Math.floor(examenSegundosRestantes / 60).toString().padStart(2, "0");
    const s = (examenSegundosRestantes % 60).toString().padStart(2, "0");
    el.textContent = `${m}:${s}`;
    if (examenSegundosRestantes <= 0) {
      clearInterval(examenTimerInterval);
      document.getElementById("examen-form").requestSubmit();
    }
  }, 1000);
}

document.getElementById("examen-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  clearInterval(examenTimerInterval);

  const formData = new FormData(e.target);
  const respuestas = [];
  for (const [key, value] of formData.entries()) {
    respuestas.push({ pregunta_id: parseInt(key.replace("pregunta-", ""), 10), opcion: value });
  }

  try {
    const resultado = await apiFetch(ENDPOINTS.examenResponder, {
      method: "POST",
      body: {
        examen_id: examenIdActual,
        materia_id: parseInt(examenMateriaActual, 10),
        fecha_inicio: examenFechaInicio,
        respuestas,
      },
    });
    const porcentaje = resultado.porcentaje ?? resultado.calificacion ?? 0;
    const aprobo = resultado.aprobado ?? porcentaje >= 80;

    document.getElementById("examen-form").classList.add("hidden");
    document.getElementById("examen-timer").classList.add("hidden");
    const resCard = document.getElementById("examen-resultado");
    resCard.classList.remove("hidden");
    document.getElementById("resultado-porcentaje").textContent = `${porcentaje}%`;
    document.getElementById("resultado-texto").textContent = aprobo
      ? "¡Aprobado! Ya puedes recibir estudiantes en esta materia."
      : "No aprobaste. Esta materia queda bloqueada 4 meses antes de reintentar.";
  } catch (err) {
    alert(err.message);
  }
});

// ---------- chat ----------
let chatActivo = null;
let chatPolling = null;

async function cargarConversaciones() {
  const select = document.getElementById("select-chat");
  const empty = document.getElementById("chat-empty");
  const box = document.getElementById("chat-box");
  const btnFinalizar = document.getElementById("btn-finalizar-asesoria");
  try {
    const solicitudes = await apiFetch(ENDPOINTS.misSolicitudesAsesor);
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
      .map((s) => `<option value="${s.id}">${s.materia?.nombre ?? s.materia_id} — ${s.estudiante?.nombre ?? ""}</option>`)
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

cargarSolicitudes();
