// src/controllers/materiaController.js
const materiaModel = require('../models/materiaModel');

async function listar(req, res, next) {
  try {
    const materias = await materiaModel.listarTodas();
    res.json({ ok: true, data: materias });
  } catch (err) { next(err); }
}

module.exports = { listar };
