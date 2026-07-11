// src/controllers/solicitudController.js
const solicitudService = require('../services/solicitudService');
const estudianteService = require('../services/estudianteService');
const asesorService = require('../services/asesorService');
const mailService = require('../services/mailService');

async function crear(req, res, next) {
  try {
    const estudiante = await estudianteService.obtenerPerfil(req.usuario.id);
    const id = await solicitudService.crearSolicitud(estudiante.id, req.body.asesor_id, req.body.materia_id);
    res.status(201).json({ ok: true, mensaje: 'Solicitud enviada.', data: { id } });
  } catch (err) { next(err); }
}

async function misSolicitudesEstudiante(req, res, next) {
  try {
    const estudiante = await estudianteService.obtenerPerfil(req.usuario.id);
    const data = await solicitudService.listarPorEstudiante(estudiante.id);
    res.json({ ok: true, data });
  } catch (err) { next(err); }
}

async function misSolicitudesAsesor(req, res, next) {
  try {
    const asesor = await asesorService.obtenerPerfil(req.usuario.id);
    const data = await solicitudService.listarPorAsesor(asesor.id);
    res.json({ ok: true, data });
  } catch (err) { next(err); }
}

async function responder(req, res, next) {
  try {
    const asesor = await asesorService.obtenerPerfil(req.usuario.id);
    const resultado = await solicitudService.responderSolicitud(asesor.id, req.params.id, req.body.aceptar === true);
    res.json({ ok: true, mensaje: `Solicitud ${resultado.estatus}.`, data: resultado });
  } catch (err) { next(err); }
}

async function cancelar(req, res, next) {
  try {
    let propietarioId;
    if (req.usuario.rol === 'estudiante') {
      propietarioId = (await estudianteService.obtenerPerfil(req.usuario.id)).id;
    } else if (req.usuario.rol === 'asesor') {
      propietarioId = (await asesorService.obtenerPerfil(req.usuario.id)).id;
    }
    await solicitudService.cancelarSolicitud(req.usuario.rol, propietarioId, req.params.id);
    res.json({ ok: true, mensaje: 'Solicitud cancelada.' });
  } catch (err) { next(err); }
}

module.exports = { crear, misSolicitudesEstudiante, misSolicitudesAsesor, responder, cancelar };
