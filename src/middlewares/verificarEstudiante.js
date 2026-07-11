// src/middlewares/verificarEstudiante.js
const AppError = require('../utils/AppError');

function verificarEstudiante(req, res, next) {
  if (!req.usuario || req.usuario.rol !== 'estudiante') {
    return next(new AppError('Acceso restringido: se requiere rol de estudiante.', 403));
  }
  next();
}

module.exports = verificarEstudiante;
