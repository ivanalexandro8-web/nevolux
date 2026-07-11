// src/controllers/examenController.js
const examenService = require('../services/examenService');
const asesorService = require('../services/asesorService');

async function iniciar(req, res, next) {
  try {
    const perfil = await asesorService.obtenerPerfil(req.usuario.id);
    const data = await examenService.iniciarExamen(perfil.id, req.body.materia_id);
    res.json({ ok: true, data });
  } catch (err) { next(err); }
}

async function responder(req, res, next) {
  try {
    const perfil = await asesorService.obtenerPerfil(req.usuario.id);
    const data = await examenService.responderExamen(perfil.id, req.body);
    const mensaje = data.resultado === 'aprobado'
      ? 'Tus respuestas fueron enviadas al administrador. ¡Felicidades, aprobaste! Revisa tu correo.'
      : 'Tus respuestas fueron enviadas al administrador. Lo sentimos, tu peticion ha sido denegada.';
    res.json({ ok: true, mensaje, data });
  } catch (err) { next(err); }
}

module.exports = { iniciar, responder };
