// src/controllers/quejaController.js
const quejaService = require('../services/quejaService');

async function crear(req, res, next) {
  try {
    const id = await quejaService.crearQueja(req.usuario.id, req.body.tipo, req.body.mensaje);
    res.status(201).json({ ok: true, mensaje: 'Tu mensaje fue enviado al administrador.', data: { id } });
  } catch (err) { next(err); }
}

async function listar(req, res, next) {
  try {
    const data = await quejaService.listarTodas();
    res.json({ ok: true, data });
  } catch (err) { next(err); }
}

async function responder(req, res, next) {
  try {
    await quejaService.responder(req.params.id, req.body.respuesta);
    res.json({ ok: true, mensaje: 'Respuesta enviada.' });
  } catch (err) { next(err); }
}

module.exports = { crear, listar, responder };
