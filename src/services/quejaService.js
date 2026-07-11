// src/services/quejaService.js
const AppError = require('../utils/AppError');
const quejaModel = require('../models/quejaModel');

async function crearQueja(usuarioId, tipo, mensaje) {
  if (!['queja', 'sugerencia'].includes(tipo)) {
    throw new AppError('Tipo invalido, debe ser "queja" o "sugerencia".', 400);
  }
  return quejaModel.crear(usuarioId, tipo, mensaje);
}

async function listarTodas() {
  return quejaModel.listarTodas();
}

async function responder(id, respuesta) {
  const queja = await quejaModel.buscarPorId(id);
  if (!queja) throw new AppError('Queja o sugerencia no encontrada.', 404);
  await quejaModel.responder(id, respuesta);
}

module.exports = { crearQueja, listarTodas, responder };
