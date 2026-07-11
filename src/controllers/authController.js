// src/controllers/authController.js
const { validationResult } = require('express-validator');
const authService = require('../services/authService');
const AppError = require('../utils/AppError');

async function registroEstudiante(req, res, next) {
  try {
    const errores = validationResult(req);
    if (!errores.isEmpty()) throw new AppError(errores.array()[0].msg, 400);

    const resultado = await authService.registrarEstudiante(req.body);
    res.status(201).json({ ok: true, mensaje: 'Registro exitoso. Ya puedes iniciar sesion.', data: resultado });
  } catch (err) {
    next(err);
  }
}

async function registroAsesor(req, res, next) {
  try {
    const errores = validationResult(req);
    if (!errores.isEmpty()) throw new AppError(errores.array()[0].msg, 400);

    const resultado = await authService.registrarAsesor(req.body);
    res.status(201).json({
      ok: true,
      mensaje: 'Registro recibido. Ahora debes presentar el examen de la materia elegida.',
      data: resultado
    });
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const errores = validationResult(req);
    if (!errores.isEmpty()) throw new AppError(errores.array()[0].msg, 400);

    const { correo, password } = req.body;
    const resultado = await authService.login(correo, password);
    res.status(200).json({ ok: true, data: resultado });
  } catch (err) {
    next(err);
  }
}

module.exports = { registroEstudiante, registroAsesor, login };
