// src/models/horarioModel.js
const pool = require('../config/db');

async function crear(asesorId, datos) {
  const [res] = await pool.query(
    'INSERT INTO horarios (asesor_id, dia_semana, hora_inicio, hora_fin) VALUES (?, ?, ?, ?)',
    [asesorId, datos.dia_semana, datos.hora_inicio, datos.hora_fin]
  );
  return res.insertId;
}

async function listarPorAsesor(asesorId) {
  const [rows] = await pool.query('SELECT * FROM horarios WHERE asesor_id = ? ORDER BY dia_semana, hora_inicio', [asesorId]);
  return rows;
}

async function buscarPorId(id) {
  const [rows] = await pool.query('SELECT * FROM horarios WHERE id = ?', [id]);
  return rows[0] || null;
}

async function actualizar(id, campos) {
  const claves = Object.keys(campos);
  if (claves.length === 0) return;
  const set = claves.map((c) => `${c} = ?`).join(', ');
  const valores = claves.map((c) => campos[c]);
  await pool.query(`UPDATE horarios SET ${set} WHERE id = ?`, [...valores, id]);
}

async function eliminar(id) {
  await pool.query('DELETE FROM horarios WHERE id = ?', [id]);
}

module.exports = { crear, listarPorAsesor, buscarPorId, actualizar, eliminar };
