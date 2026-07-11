// src/models/quejaModel.js
const pool = require('../config/db');

async function crear(usuarioId, tipo, mensaje) {
  const [res] = await pool.query(
    `INSERT INTO quejas_sugerencias (usuario_id, tipo, mensaje, estatus) VALUES (?, ?, ?, 'pendiente')`,
    [usuarioId, tipo, mensaje]
  );
  return res.insertId;
}

async function listarTodas() {
  const [rows] = await pool.query(
    `SELECT q.*, u.nombre, u.apellido_paterno, u.correo, u.rol
     FROM quejas_sugerencias q JOIN usuarios u ON u.id = q.usuario_id
     ORDER BY q.creado_en DESC`
  );
  return rows;
}

async function buscarPorId(id) {
  const [rows] = await pool.query('SELECT * FROM quejas_sugerencias WHERE id = ?', [id]);
  return rows[0] || null;
}

async function responder(id, respuesta) {
  await pool.query(
    `UPDATE quejas_sugerencias SET respuesta_admin = ?, estatus = 'atendida' WHERE id = ?`,
    [respuesta, id]
  );
}

module.exports = { crear, listarTodas, buscarPorId, responder };
