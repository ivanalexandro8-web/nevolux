// src/services/chatService.js
const AppError = require('../utils/AppError');
const solicitudModel = require('../models/solicitudModel');
const mensajeModel = require('../models/mensajeModel');

async function verificarParticipante(solicitud, usuarioId, rol) {
  // Aqui solicitud.estudiante_id/asesor_id son IDs de las tablas estudiantes/asesores,
  // por eso el controller resuelve el id correcto segun el rol antes de llamar esto.
  if (rol === 'estudiante' && solicitud.estudiante_id !== usuarioId) return false;
  if (rol === 'asesor' && solicitud.asesor_id !== usuarioId) return false;
  return true;
}

async function enviarMensaje(solicitudId, emisorUsuarioId, rolPropietarioId, rol, texto) {
  const solicitud = await solicitudModel.buscarPorId(solicitudId);
  if (!solicitud) throw new AppError('Conversacion no encontrada.', 404);
  if (solicitud.estatus !== 'aceptada') {
    throw new AppError('El chat solo esta disponible cuando la solicitud fue aceptada.', 400);
  }

  const puede = await verificarParticipante(solicitud, rolPropietarioId, rol);
  if (!puede) throw new AppError('No perteneces a esta conversacion.', 403);

  return mensajeModel.crear(solicitudId, emisorUsuarioId, texto);
}

async function listarMensajes(solicitudId, rolPropietarioId, rol) {
  const solicitud = await solicitudModel.buscarPorId(solicitudId);
  if (!solicitud) throw new AppError('Conversacion no encontrada.', 404);

  const puede = await verificarParticipante(solicitud, rolPropietarioId, rol);
  if (!puede) throw new AppError('No perteneces a esta conversacion.', 403);

  return mensajeModel.listarPorSolicitud(solicitudId);
}

module.exports = { enviarMensaje, listarMensajes };
