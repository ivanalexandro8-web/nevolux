// src/services/adminService.js
const bcrypt = require('bcryptjs');
const AppError = require('../utils/AppError');
const usuarioModel = require('../models/usuarioModel');
const asesorMateriaModel = require('../models/asesorMateriaModel');
const asesorModel = require('../models/asesorModel');

async function listarEstudiantes() {
  return usuarioModel.listarPorRol('estudiante');
}

async function listarAsesores() {
  return usuarioModel.listarPorRol('asesor');
}

async function eliminarCuenta(usuarioId) {
  const usuario = await usuarioModel.buscarPorId(usuarioId);
  if (!usuario) throw new AppError('Usuario no encontrado.', 404);
  if (usuario.rol === 'admin') throw new AppError('No se puede eliminar la cuenta de administrador.', 403);
  await usuarioModel.eliminar(usuarioId);
}

async function restablecerPassword(usuarioId, passwordNueva) {
  const usuario = await usuarioModel.buscarPorId(usuarioId);
  if (!usuario) throw new AppError('Usuario no encontrado.', 404);
  const hash = await bcrypt.hash(passwordNueva, 10);
  await usuarioModel.actualizarPassword(usuarioId, hash);
}

// Revision manual opcional de un intento de examen (el sistema ya autocalifica,
// pero el administrador puede revertir la decision si detecta una anomalia)
async function revisarSolicitudAsesor(asesorMateriaId, aprobar) {
  await asesorMateriaModel.actualizarEstatus(asesorMateriaId, aprobar ? 'aprobado' : 'rechazado', null);
}

module.exports = { listarEstudiantes, listarAsesores, eliminarCuenta, restablecerPassword, revisarSolicitudAsesor };
