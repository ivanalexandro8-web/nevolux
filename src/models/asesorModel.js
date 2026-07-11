// src/models/asesorModel.js
const pool = require('../config/db');

async function crear(cn, usuarioId, datos) {
  const [res] = await cn.query(
    `INSERT INTO asesores (usuario_id, matricula, cuatrimestre, curriculum, estatus_general) VALUES (?, ?, ?, ?, 'pendiente')`,
    [usuarioId, datos.matricula, datos.cuatrimestre, datos.curriculum]
  );
  return res.insertId;
}

async function buscarPorUsuarioId(usuarioId) {
  const [rows] = await pool.query(
    `SELECT a.*, u.nombre, u.apellido_paterno, u.apellido_materno, u.correo, u.foto_perfil
     FROM asesores a JOIN usuarios u ON u.id = a.usuario_id WHERE a.usuario_id = ?`,
    [usuarioId]
  );
  return rows[0] || null;
}

async function buscarPorId(id) {
  const [rows] = await pool.query('SELECT * FROM asesores WHERE id = ?', [id]);
  return rows[0] || null;
}

async function buscarPorMatricula(matricula) {
  const [rows] = await pool.query('SELECT * FROM asesores WHERE matricula = ?', [matricula]);
  return rows[0] || null;
}

async function actualizarEstatusGeneral(id, estatus) {
  await pool.query('UPDATE asesores SET estatus_general = ? WHERE id = ?', [estatus, id]);
}

async function actualizar(id, campos) {
  const claves = Object.keys(campos);
  if (claves.length === 0) return;
  const set = claves.map((c) => `${c} = ?`).join(', ');
  const valores = claves.map((c) => campos[c]);
  await pool.query(`UPDATE asesores SET ${set} WHERE id = ?`, [...valores, id]);
}

// Buscar asesores aprobados que impartan una materia (para el buscador del estudiante)
async function buscarPorMateria(materiaId) {
  const [rows] = await pool.query(
    `SELECT a.id AS asesor_id, u.nombre, u.apellido_paterno, u.apellido_materno, u.foto_perfil, am.estatus
     FROM asesor_materia am
     JOIN asesores a ON a.id = am.asesor_id
     JOIN usuarios u ON u.id = a.usuario_id
     WHERE am.materia_id = ? AND am.estatus = 'aprobado'`,
    [materiaId]
  );
  return rows;
}

module.exports = { crear, buscarPorUsuarioId, buscarPorId, buscarPorMatricula, actualizarEstatusGeneral, actualizar, buscarPorMateria };
