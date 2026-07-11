// src/models/usuarioModel.js
// Solo queries. Sin logica de negocio aqui.
const pool = require('../config/db');

async function crear(cn, datos) {
  const [res] = await cn.query(
    `INSERT INTO usuarios (nombre, apellido_paterno, apellido_materno, fecha_nacimiento, correo, password_hash, rol, foto_perfil)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [datos.nombre, datos.apellido_paterno, datos.apellido_materno, datos.fecha_nacimiento,
     datos.correo, datos.password_hash, datos.rol, datos.foto_perfil || null]
  );
  return res.insertId;
}

async function buscarPorCorreo(correo) {
  const [rows] = await pool.query('SELECT * FROM usuarios WHERE correo = ?', [correo]);
  return rows[0] || null;
}

async function buscarPorId(id) {
  const [rows] = await pool.query('SELECT * FROM usuarios WHERE id = ?', [id]);
  return rows[0] || null;
}

async function actualizarDatos(id, campos) {
  const claves = Object.keys(campos);
  if (claves.length === 0) return;
  const set = claves.map((c) => `${c} = ?`).join(', ');
  const valores = claves.map((c) => campos[c]);
  await pool.query(`UPDATE usuarios SET ${set} WHERE id = ?`, [...valores, id]);
}

async function actualizarPassword(id, passwordHash) {
  await pool.query('UPDATE usuarios SET password_hash = ? WHERE id = ?', [passwordHash, id]);
}

async function eliminar(id) {
  await pool.query('DELETE FROM usuarios WHERE id = ?', [id]);
}

async function listarPorRol(rol) {
  const [rows] = await pool.query('SELECT id, nombre, apellido_paterno, apellido_materno, correo, activo, creado_en FROM usuarios WHERE rol = ?', [rol]);
  return rows;
}

module.exports = { crear, buscarPorCorreo, buscarPorId, actualizarDatos, actualizarPassword, eliminar, listarPorRol };
