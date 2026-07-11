// src/models/examenModel.js
const pool = require('../config/db');

async function buscarPorMateria(materiaId) {
  const [rows] = await pool.query('SELECT * FROM examenes WHERE materia_id = ?', [materiaId]);
  return rows[0] || null;
}

module.exports = { buscarPorMateria };
