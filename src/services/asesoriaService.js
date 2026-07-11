// src/services/asesoriaService.js
const AppError = require('../utils/AppError');
const asesoriaModel = require('../models/asesoriaModel');
const solicitudModel = require('../models/solicitudModel');

async function finalizarAsesoria(solicitudId) {
  const solicitud = await solicitudModel.buscarPorId(solicitudId);
  if (!solicitud) throw new AppError('Solicitud no encontrada.', 404);

  const asesoria = await asesoriaModel.buscarPorSolicitud(solicitudId);
  if (!asesoria) throw new AppError('No existe una asesoria activa para esta solicitud.', 404);

  await asesoriaModel.actualizarEstatus(asesoria.id, 'finalizada');
  return { estatus: 'finalizada' };
}

module.exports = { finalizarAsesoria };
