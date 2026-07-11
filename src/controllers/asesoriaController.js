// src/controllers/asesoriaController.js
const asesoriaService = require('../services/asesoriaService');

async function finalizar(req, res, next) {
  try {
    const data = await asesoriaService.finalizarAsesoria(req.params.solicitudId);
    res.json({ ok: true, mensaje: 'Asesoria finalizada.', data });
  } catch (err) { next(err); }
}

module.exports = { finalizar };
