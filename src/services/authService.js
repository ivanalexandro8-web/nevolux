// src/services/authService.js
// Toda la logica de negocio de registro y login vive aqui. Los controllers solo llaman esto.
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');
const AppError = require('../utils/AppError');

const usuarioModel = require('../models/usuarioModel');
const estudianteModel = require('../models/estudianteModel');
const asesorModel = require('../models/asesorModel');
const asesorMateriaModel = require('../models/asesorMateriaModel');
const materiaModel = require('../models/materiaModel');

function generarToken(usuario) {
  return jwt.sign(
    { id: usuario.id, rol: usuario.rol, correo: usuario.correo },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES || '8h' }
  );
}

async function registrarEstudiante(datos) {
  const existente = await usuarioModel.buscarPorCorreo(datos.correo);
  if (existente) throw new AppError('Ya existe una cuenta con ese correo.', 409);

  const matriculaExistente = await estudianteModel.buscarPorMatricula(datos.matricula);
  if (matriculaExistente) throw new AppError('Esa matricula ya esta registrada.', 409);

  const passwordHash = await bcrypt.hash(datos.password, 10);

  const cn = await pool.getConnection();
  try {
    await cn.beginTransaction();
    const usuarioId = await usuarioModel.crear(cn, { ...datos, password_hash: passwordHash, rol: 'estudiante' });
    await estudianteModel.crear(cn, usuarioId, datos);
    await cn.commit();
    return { id: usuarioId, correo: datos.correo };
  } catch (err) {
    await cn.rollback();
    throw err;
  } finally {
    cn.release();
  }
}

async function registrarAsesor(datos) {
  if (Number(datos.cuatrimestre) < 4) {
    throw new AppError('Solo pueden registrarse como asesor estudiantes de 4to cuatrimestre en adelante.', 400);
  }

  const existente = await usuarioModel.buscarPorCorreo(datos.correo);
  if (existente) throw new AppError('Ya existe una cuenta con ese correo.', 409);

  const matriculaExistente = await asesorModel.buscarPorMatricula(datos.matricula);
  if (matriculaExistente) throw new AppError('Esa matricula ya esta registrada.', 409);

  const materia = await materiaModel.buscarPorId(datos.materia_id);
  if (!materia) throw new AppError('La materia seleccionada no existe.', 400);

  const passwordHash = await bcrypt.hash(datos.password, 10);

  const cn = await pool.getConnection();
  try {
    await cn.beginTransaction();
    const usuarioId = await usuarioModel.crear(cn, { ...datos, password_hash: passwordHash, rol: 'asesor' });
    const asesorId = await asesorModel.crear(cn, usuarioId, datos);
    await asesorMateriaModel.crear(cn, asesorId, datos.materia_id);
    await cn.commit();
    return { id: usuarioId, asesorId, materiaId: datos.materia_id };
  } catch (err) {
    await cn.rollback();
    throw err;
  } finally {
    cn.release();
  }
}

async function login(correo, password) {
  const usuario = await usuarioModel.buscarPorCorreo(correo);
  if (!usuario) throw new AppError('Correo o contraseña incorrectos.', 401);
  if (!usuario.activo) throw new AppError('Esta cuenta ha sido deshabilitada.', 403);

  const passwordOk = await bcrypt.compare(password, usuario.password_hash);
  if (!passwordOk) throw new AppError('Correo o contraseña incorrectos.', 401);

  const token = generarToken(usuario);
  return {
    token,
    usuario: {
      id: usuario.id,
      nombre: usuario.nombre,
      correo: usuario.correo,
      rol: usuario.rol,
      foto_perfil: usuario.foto_perfil
    }
  };
}

module.exports = { registrarEstudiante, registrarAsesor, login };
