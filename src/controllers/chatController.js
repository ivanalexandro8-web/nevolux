// src/controllers/chatController.js
const chatService = require('../services/chatService');
const estudianteService = require('../services/estudianteService');
const asesorService = require('../services/asesorService');

async function resolverPropietarioId(req) {
  if (req.usuario.rol === 'estudiante') {
    return (await estudianteService.obtenerPerfil(req.usuario.id)).id;
  }
  return (await asesorService.obtenerPerfil(req.usuario.id)).id;
}

async function enviar(req, res, next) {
  try {
    const propietarioId = await resolverPropietarioId(req);
    const id = await chatService.enviarMensaje(req.params.solicitudId, req.usuario.id, propietarioId, req.usuario.rol, req.body.texto);
    res.status(201).json({ ok: true, data: { id } });
  } catch (err) { next(err); }
}

async function listar(req, res, next) {
  try {
    const propietarioId = await resolverPropietarioId(req);
    const data = await chatService.listarMensajes(req.params.solicitudId, propietarioId, req.usuario.rol);
    res.json({ ok: true, data });
  } catch (err) { next(err); }
}

module.exports = { enviar, listar };
