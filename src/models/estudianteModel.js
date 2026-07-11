// src/models/estudianteModel.js
const pool = require('../config/db');

async function crear(cn, usuarioId, datos) {
  const [res] = await cn.query(
    `INSERT INTO estudiantes (usuario_id, matricula, cuatrimestre, carrera) VALUES (?, ?, ?, ?)`,
    [usuarioId, datos.matricula, datos.cuatrimestre, datos.carrera]
  );
  return res.insertId;
}

async function buscarPorUsuarioId(usuarioId) {
  const [rows] = await pool.query(
    `SELECT e.*, u.nombre, u.apellido_paterno, u.apellido_materno, u.correo, u.foto_perfil
     FROM estudiantes e JOIN usuarios u ON u.id = e.usuario_id WHERE e.usuario_id = ?`,
    [usuarioId]
  );
  return rows[0] || null;
}

async function buscarPorMatricula(matricula) {
  const [rows] = await pool.query('SELECT * FROM estudiantes WHERE matricula = ?', [matricula]);
  return rows[0] || null;
}

async function actualizar(id, campos) {
  const claves = Object.keys(campos);
  if (claves.length === 0) return;
  const set = claves.map((c) => `${c} = ?`).join(', ');
  const valores = claves.map((c) => campos[c]);
  await pool.query(`UPDATE estudiantes SET ${set} WHERE id = ?`, [...valores, id]);
}

module.exports = { crear, buscarPorUsuarioId, buscarPorMatricula, actualizar };
