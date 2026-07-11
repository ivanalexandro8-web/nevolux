// src/models/intentoExamenModel.js
const pool = require('../config/db');

async function crear(datos) {
  const [res] = await pool.query(
    `INSERT INTO intentos_examen (asesor_id, examen_id, materia_id, respuestas, puntaje, resultado, fecha_inicio)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [datos.asesor_id, datos.examen_id, datos.materia_id, JSON.stringify(datos.respuestas),
     datos.puntaje, datos.resultado, datos.fecha_inicio]
  );
  return res.insertId;
}

async function ultimoIntento(asesorId, materiaId) {
  const [rows] = await pool.query(
    `SELECT * FROM intentos_examen WHERE asesor_id = ? AND materia_id = ? ORDER BY fecha_fin DESC LIMIT 1`,
    [asesorId, materiaId]
  );
  return rows[0] || null;
}

async function listarPorAsesor(asesorId) {
  const [rows] = await pool.query('SELECT * FROM intentos_examen WHERE asesor_id = ? ORDER BY fecha_fin DESC', [asesorId]);
  return rows;
}

module.exports = { crear, ultimoIntento, listarPorAsesor };
