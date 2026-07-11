// src/services/solicitudService.js
const AppError = require('../utils/AppError');
const solicitudModel = require('../models/solicitudModel');
const asesoriaModel = require('../models/asesoriaModel');
const asesorMateriaModel = require('../models/asesorMateriaModel');
const usuarioModel = require('../models/usuarioModel');
const asesorModel = require('../models/asesorModel');
const mailService = require('./mailService');

async function crearSolicitud(estudianteId, asesorId, materiaId) {
  const relacion = await asesorMateriaModel.buscar(asesorId, materiaId);
  if (!relacion || relacion.estatus !== 'aprobado') {
    throw new AppError('Ese asesor no esta aprobado para impartir esta materia.', 400);
  }
  return solicitudModel.crear(estudianteId, asesorId, materiaId);
}

async function listarPorEstudiante(estudianteId) {
  return solicitudModel.listarPorEstudiante(estudianteId);
}

async function listarPorAsesor(asesorId) {
  return solicitudModel.listarPorAsesor(asesorId);
}

async function responderSolicitud(asesorId, solicitudId, aceptar) {
  const solicitud = await solicitudModel.buscarPorId(solicitudId);
  if (!solicitud || solicitud.asesor_id !== asesorId) {
    throw new AppError('Solicitud no encontrada.', 404);
  }
  if (solicitud.estatus !== 'pendiente') {
    throw new AppError('Esta solicitud ya fue procesada.', 400);
  }

  if (aceptar) {
    await solicitudModel.actualizarEstatus(solicitudId, 'aceptada');
    await asesoriaModel.crear(solicitudId);

    const asesor = await asesorModel.buscarPorId(asesorId);
    const usuarioAsesor = await usuarioModel.buscarPorId(asesor.usuario_id);
    // el correo del estudiante se resuelve en el controller/service superior si se requiere
    return { estatus: 'aceptada', asesorNombre: usuarioAsesor.nombre };
  }

  await solicitudModel.actualizarEstatus(solicitudId, 'rechazada');
  return { estatus: 'rechazada' };
}

async function cancelarSolicitud(usuarioRol, propietarioId, solicitudId) {
  const solicitud = await solicitudModel.buscarPorId(solicitudId);
  if (!solicitud) throw new AppError('Solicitud no encontrada.', 404);

  const esDueno = (usuarioRol === 'estudiante' && solicitud.estudiante_id === propietarioId) ||
                  (usuarioRol === 'asesor' && solicitud.asesor_id === propietarioId);
  if (!esDueno) throw new AppError('No tienes permiso para cancelar esta solicitud.', 403);

  await solicitudModel.actualizarEstatus(solicitudId, 'cancelada');

  const asesoria = await asesoriaModel.buscarPorSolicitud(solicitudId);
  if (asesoria) await asesoriaModel.actualizarEstatus(asesoria.id, 'cancelada');
}

module.exports = { crearSolicitud, listarPorEstudiante, listarPorAsesor, responderSolicitud, cancelarSolicitud };
