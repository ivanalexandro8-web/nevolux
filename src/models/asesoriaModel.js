// src/models/asesoriaModel.js
const pool = require('../config/db');

async function crear(solicitudId) {
  const [res] = await pool.query(
    `INSERT INTO asesorias (solicitud_id, estatus) VALUES (?, 'activa')`,
    [solicitudId]
  );
  return res.insertId;
}

async function buscarPorSolicitud(solicitudId) {
  const [rows] = await pool.query('SELECT * FROM asesorias WHERE solicitud_id = ?', [solicitudId]);
  return rows[0] || null;
}

async function actualizarEstatus(id, estatus) {
  const fechaFin = estatus === 'finalizada' || estatus === 'cancelada' ? new Date() : null;
  await pool.query('UPDATE asesorias SET estatus = ?, fecha_fin = ? WHERE id = ?', [estatus, fechaFin, id]);
}

module.exports = { crear, buscarPorSolicitud, actualizarEstatus };
