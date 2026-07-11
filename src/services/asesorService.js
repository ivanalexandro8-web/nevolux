// src/services/asesorService.js
const bcrypt = require('bcryptjs');
const AppError = require('../utils/AppError');
const asesorModel = require('../models/asesorModel');
const usuarioModel = require('../models/usuarioModel');
const horarioModel = require('../models/horarioModel');
const asesorMateriaModel = require('../models/asesorMateriaModel');

async function obtenerPerfil(usuarioId) {
  const perfil = await asesorModel.buscarPorUsuarioId(usuarioId);
  if (!perfil) throw new AppError('Asesor no encontrado.', 404);
  const materias = await asesorMateriaModel.listarPorAsesor(perfil.id);
  const horarios = await horarioModel.listarPorAsesor(perfil.id);
  return { ...perfil, materias, horarios };
}

async function actualizarPerfil(usuarioId, campos) {
  const usuarioCampos = {};
  const asesorCampos = {};

  ['nombre', 'apellido_paterno', 'apellido_materno', 'foto_perfil'].forEach((c) => {
    if (campos[c] !== undefined) usuarioCampos[c] = campos[c];
  });
  ['cuatrimestre', 'curriculum'].forEach((c) => {
    if (campos[c] !== undefined) asesorCampos[c] = campos[c];
  });

  if (Object.keys(usuarioCampos).length) await usuarioModel.actualizarDatos(usuarioId, usuarioCampos);

  if (Object.keys(asesorCampos).length) {
    const perfil = await asesorModel.buscarPorUsuarioId(usuarioId);
    await asesorModel.actualizar(perfil.id, asesorCampos);
  }

  return obtenerPerfil(usuarioId);
}

async function cambiarPassword(usuarioId, passwordActual, passwordNueva) {
  const usuario = await usuarioModel.buscarPorId(usuarioId);
  const ok = await bcrypt.compare(passwordActual, usuario.password_hash);
  if (!ok) throw new AppError('La contraseña actual no es correcta.', 400);

  const hash = await bcrypt.hash(passwordNueva, 10);
  await usuarioModel.actualizarPassword(usuarioId, hash);
}

async function agregarHorario(asesorId, datos) {
  if (datos.hora_inicio >= datos.hora_fin) {
    throw new AppError('La hora de inicio debe ser menor a la hora de fin.', 400);
  }
  return horarioModel.crear(asesorId, datos);
}

async function actualizarHorario(asesorId, horarioId, campos) {
  const horario = await horarioModel.buscarPorId(horarioId);
  if (!horario || horario.asesor_id !== asesorId) {
    throw new AppError('Horario no encontrado.', 404);
  }
  await horarioModel.actualizar(horarioId, campos);
}

async function eliminarHorario(asesorId, horarioId) {
  const horario = await horarioModel.buscarPorId(horarioId);
  if (!horario || horario.asesor_id !== asesorId) {
    throw new AppError('Horario no encontrado.', 404);
  }
  await horarioModel.eliminar(horarioId);
}

module.exports = { obtenerPerfil, actualizarPerfil, cambiarPassword, agregarHorario, actualizarHorario, eliminarHorario };
