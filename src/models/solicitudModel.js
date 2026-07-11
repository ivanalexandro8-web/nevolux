// src/models/solicitudModel.js
const pool = require('../config/db');

async function crear(estudianteId, asesorId, materiaId) {
  const [res] = await pool.query(
    `INSERT INTO solicitudes (estudiante_id, asesor_id, materia_id, estatus) VALUES (?, ?, ?, 'pendiente')`,
    [estudianteId, asesorId, materiaId]
  );
  return res.insertId;
}

async function buscarPorId(id) {
  const [rows] = await pool.query('SELECT * FROM solicitudes WHERE id = ?', [id]);
  return rows[0] || null;
}

async function listarPorEstudiante(estudianteId) {
  const [rows] = await pool.query(
    `SELECT s.*, m.nombre AS materia_nombre, u.nombre AS asesor_nombre
     FROM solicitudes s
     JOIN materias m ON m.id = s.materia_id
     JOIN asesores a ON a.id = s.asesor_id
     JOIN usuarios u ON u.id = a.usuario_id
     WHERE s.estudiante_id = ? ORDER BY s.creado_en DESC`,
    [estudianteId]
  );
  return rows;
}

async function listarPorAsesor(asesorId) {
  const [rows] = await pool.query(
    `SELECT s.*, m.nombre AS materia_nombre, u.nombre AS estudiante_nombre
     FROM solicitudes s
     JOIN materias m ON m.id = s.materia_id
     JOIN estudiantes e ON e.id = s.estudiante_id
     JOIN usuarios u ON u.id = e.usuario_id
     WHERE s.asesor_id = ? ORDER BY s.creado_en DESC`,
    [asesorId]
  );
  return rows;
}

async function actualizarEstatus(id, estatus) {
  await pool.query('UPDATE solicitudes SET estatus = ? WHERE id = ?', [estatus, id]);
}

module.exports = { crear, buscarPorId, listarPorEstudiante, listarPorAsesor, actualizarEstatus };
