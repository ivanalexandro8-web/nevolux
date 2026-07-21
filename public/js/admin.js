const session = requireRole("administrador");
if (session) document.getElementById("session-nombre").textContent = session.nombre || "Admin";

// ---------- navegación ----------
const views = ["estudiantes", "asesores", "quejas"];
document.querySelectorAll(".nav-item").forEach((item) => {
  item.addEventListener("click", () => {
    document.querySelectorAll(".nav-item").forEach((i) => i.classList.remove("active"));
    item.classList.add("active");
    views.forEach((v) => document.getElementById(`view-${v}`).classList.add("hidden"));
    document.getElementById(`view-${item.dataset.view}`).classList.remove("hidden");
    if (item.dataset.view === "asesores") cargarAsesores();
    if (item.dataset.view === "quejas") cargarQuejas();
  });
});

// ---------- estudiantes ----------
async function cargarEstudiantes() {
  const tbody = document.querySelector("#tabla-estudiantes tbody");
  const empty = document.getElementById("estudiantes-empty");
  try {
    const estudiantes = await apiFetch(ENDPOINTS.adminEstudiantes);
    const lista = Array.isArray(estudiantes) ? estudiantes : estudiantes.estudiantes || [];
    tbody.innerHTML = "";
    if (lista.length === 0) {
      empty.classList.remove("hidden");
      return;
    }
    empty.classList.add("hidden");
    lista.forEach((u) => {
      const nombreCompleto = [u.nombre, u.apellido_paterno, u.apellido_materno].filter(Boolean).join(" ");
      const tr = document.createElement("tr");
      tr.innerHTML = `<td>${nombreCompleto}</td>
        <td>${u.correo}</td>
        <td>${u.matricula ?? "—"}</td>
        <td>${u.cuatrimestre ?? "—"}</td>
        <td>
          <button class="btn btn-ghost" style="padding:0.35rem 0.8rem; font-size:0.78rem;" onclick="restablecerPassword(${u.id})">Restablecer clave</button>
          <button class="btn btn-danger" style="padding:0.35rem 0.8rem; font-size:0.78rem; margin-left:0.4rem;" onclick="eliminarCuenta(${u.id})">Eliminar</button>
        </td>`;
      tbody.appendChild(tr);
    });
  } catch (err) {
    empty.textContent = err.message;
    empty.classList.remove("hidden");
  }
}

// ---------- asesores ----------
async function cargarAsesores() {
  const tbody = document.querySelector("#tabla-asesores tbody");
  const empty = document.getElementById("asesores-empty");
  try {
    const asesores = await apiFetch(ENDPOINTS.adminAsesores);
    const lista = Array.isArray(asesores) ? asesores : asesores.asesores || [];
    tbody.innerHTML = "";
    if (lista.length === 0) {
      empty.classList.remove("hidden");
      return;
    }
    empty.classList.add("hidden");
    lista.forEach((u) => {
      const nombreCompleto = [u.nombre, u.apellido_paterno, u.apellido_materno].filter(Boolean).join(" ");
      const materias = u.materias || [];
      const materiasHtml = materias.length
        ? materias
            .map((m) => {
              const aprobado = m.aprobado === true;
              const pendiente = m.aprobado === false || m.aprobado === null || m.aprobado === undefined;
              const asesorMateriaId = m.asesor_materia_id ?? m.id;
              return `<div style="margin-bottom:0.3rem;">
                <span class="badge ${aprobado ? "badge-ok" : "badge-pending"}">${m.nombre ?? m}</span>
                ${
                  pendiente
                    ? `<button class="btn btn-primary" style="padding:0.2rem 0.6rem; font-size:0.72rem; margin-left:0.4rem;" onclick="revisarMateria(${asesorMateriaId}, true)">Aprobar</button>
                       <button class="btn btn-danger" style="padding:0.2rem 0.6rem; font-size:0.72rem; margin-left:0.3rem;" onclick="revisarMateria(${asesorMateriaId}, false)">Rechazar</button>`
                    : ""
                }
              </div>`;
            })
            .join("")
        : "—";
      const tr = document.createElement("tr");
      tr.innerHTML = `<td>${nombreCompleto}</td>
        <td>${u.correo}</td>
        <td>${materiasHtml}</td>
        <td>
          <button class="btn btn-ghost" style="padding:0.35rem 0.8rem; font-size:0.78rem;" onclick="restablecerPassword(${u.id})">Restablecer clave</button>
          <button class="btn btn-danger" style="padding:0.35rem 0.8rem; font-size:0.78rem; margin-left:0.4rem;" onclick="eliminarCuenta(${u.id})">Eliminar</button>
        </td>`;
      tbody.appendChild(tr);
    });
  } catch (err) {
    empty.textContent = err.message;
    empty.classList.remove("hidden");
  }
}

async function revisarMateria(asesorMateriaId, aprobar) {
  try {
    await apiFetch(ENDPOINTS.adminRevisarAsesorMateria(asesorMateriaId), { method: "PUT", body: { aprobar } });
    cargarAsesores();
  } catch (err) {
    alert(err.message);
  }
}

// ---------- acciones comunes de cuenta ----------
async function eliminarCuenta(id) {
  if (!confirm("¿Eliminar esta cuenta de forma permanente?")) return;
  try {
    await apiFetch(ENDPOINTS.adminEliminarCuenta(id), { method: "DELETE" });
    cargarEstudiantes();
    cargarAsesores();
  } catch (err) {
    alert(err.message);
  }
}

async function restablecerPassword(id) {
  const nueva = prompt("Nueva contraseña para este usuario:");
  if (!nueva) return;
  try {
    await apiFetch(ENDPOINTS.adminRestablecerPassword(id), { method: "PUT", body: { password_nueva: nueva } });
    alert("Contraseña restablecida.");
  } catch (err) {
    alert(err.message);
  }
}

// ---------- quejas y sugerencias ----------
async function cargarQuejas() {
  const tbody = document.querySelector("#tabla-quejas tbody");
  const empty = document.getElementById("quejas-empty");
  try {
    const quejas = await apiFetch(ENDPOINTS.quejas);
    const lista = Array.isArray(quejas) ? quejas : quejas.quejas || [];
    tbody.innerHTML = "";
    if (lista.length === 0) {
      empty.classList.remove("hidden");
      return;
    }
    empty.classList.add("hidden");
    lista.forEach((q) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `<td><span class="badge ${q.tipo === "queja" ? "badge-block" : "badge-ok"}">${q.tipo}</span></td>
        <td>${q.usuario?.nombre ?? "—"}</td>
        <td>${q.mensaje}</td>
        <td>${q.respuesta ?? "<em style='color:var(--text-muted)'>Sin responder</em>"}</td>
        <td>${
          q.respuesta
            ? ""
            : `<button class="btn btn-primary" style="padding:0.35rem 0.8rem; font-size:0.78rem;" onclick="responderQueja(${q.id})">Responder</button>`
        }</td>`;
      tbody.appendChild(tr);
    });
  } catch (err) {
    empty.textContent = err.message;
    empty.classList.remove("hidden");
  }
}

async function responderQueja(id) {
  const respuesta = prompt("Escribe tu respuesta:");
  if (!respuesta) return;
  try {
    await apiFetch(ENDPOINTS.responderQueja(id), { method: "PUT", body: { respuesta } });
    cargarQuejas();
  } catch (err) {
    alert(err.message);
  }
}

cargarEstudiantes();
