// src/services/estudianteService.js
const bcrypt = require('bcryptjs');
const AppError = require('../utils/AppError');
const estudianteModel = require('../models/estudianteModel');
const usuarioModel = require('../models/usuarioModel');
const asesorModel = require('../models/asesorModel');

async function obtenerPerfil(usuarioId) {
  const perfil = await estudianteModel.buscarPorUsuarioId(usuarioId);
  if (!perfil) throw new AppError('Estudiante no encontrado.', 404);
  return perfil;
}

async function actualizarPerfil(usuarioId, campos) {
  const usuarioCampos = {};
  const estudianteCampos = {};

  ['nombre', 'apellido_paterno', 'apellido_materno', 'foto_perfil'].forEach((c) => {
    if (campos[c] !== undefined) usuarioCampos[c] = campos[c];
  });
  ['cuatrimestre', 'carrera'].forEach((c) => {
    if (campos[c] !== undefined) estudianteCampos[c] = campos[c];
  });

  if (Object.keys(usuarioCampos).length) await usuarioModel.actualizarDatos(usuarioId, usuarioCampos);

  if (Object.keys(estudianteCampos).length) {
    const perfil = await estudianteModel.buscarPorUsuarioId(usuarioId);
    await estudianteModel.actualizar(perfil.id, estudianteCampos);
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

// Buscador de asesores por materia (lo usa el estudiante para elegir a quien pedir asesoria)
async function buscarAsesoresPorMateria(materiaId) {
  return asesorModel.buscarPorMateria(materiaId);
}

module.exports = { obtenerPerfil, actualizarPerfil, cambiarPassword, buscarAsesoresPorMateria };
