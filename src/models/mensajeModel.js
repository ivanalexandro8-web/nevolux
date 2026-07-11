// src/models/mensajeModel.js
const pool = require('../config/db');

async function crear(solicitudId, emisorId, texto) {
  const [res] = await pool.query(
    'INSERT INTO mensajes (solicitud_id, emisor_id, texto) VALUES (?, ?, ?)',
    [solicitudId, emisorId, texto]
  );
  return res.insertId;
}

async function listarPorSolicitud(solicitudId) {
  const [rows] = await pool.query(
    `SELECT msg.*, u.nombre, u.apellido_paterno FROM mensajes msg
     JOIN usuarios u ON u.id = msg.emisor_id
     WHERE msg.solicitud_id = ? ORDER BY msg.enviado_en ASC`,
    [solicitudId]
  );
  return rows;
}

module.exports = { crear, listarPorSolicitud };
