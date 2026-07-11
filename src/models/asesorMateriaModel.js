// src/models/asesorMateriaModel.js
const pool = require('../config/db');

async function crear(cn, asesorId, materiaId) {
  const [res] = await cn.query(
    `INSERT INTO asesor_materia (asesor_id, materia_id, estatus) VALUES (?, ?, 'pendiente')`,
    [asesorId, materiaId]
  );
  return res.insertId;
}

async function contarMateriasActivas(asesorId) {
  const [rows] = await pool.query(
    `SELECT COUNT(*) AS total FROM asesor_materia WHERE asesor_id = ? AND estatus IN ('pendiente','aprobado')`,
    [asesorId]
  );
  return rows[0].total;
}

async function buscar(asesorId, materiaId) {
  const [rows] = await pool.query('SELECT * FROM asesor_materia WHERE asesor_id = ? AND materia_id = ?', [asesorId, materiaId]);
  return rows[0] || null;
}

async function actualizarEstatus(id, estatus, fechaBloqueoHasta = null) {
  await pool.query('UPDATE asesor_materia SET estatus = ?, fecha_bloqueo_hasta = ? WHERE id = ?', [estatus, fechaBloqueoHasta, id]);
}

async function listarPorAsesor(asesorId) {
  const [rows] = await pool.query(
    `SELECT am.*, m.nombre AS materia_nombre FROM asesor_materia am
     JOIN materias m ON m.id = am.materia_id WHERE am.asesor_id = ?`,
    [asesorId]
  );
  return rows;
}

module.exports = { crear, contarMateriasActivas, buscar, actualizarEstatus, listarPorAsesor };
