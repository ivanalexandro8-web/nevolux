// src/models/materiaModel.js
const pool = require('../config/db');

async function listarTodas() {
  const [rows] = await pool.query('SELECT * FROM materias ORDER BY nombre');
  return rows;
}

async function buscarPorId(id) {
  const [rows] = await pool.query('SELECT * FROM materias WHERE id = ?', [id]);
  return rows[0] || null;
}

module.exports = { listarTodas, buscarPorId };
