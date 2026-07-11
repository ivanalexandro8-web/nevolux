// src/middlewares/verificarAsesor.js
const AppError = require('../utils/AppError');

function verificarAsesor(req, res, next) {
  if (!req.usuario || req.usuario.rol !== 'asesor') {
    return next(new AppError('Acceso restringido: se requiere rol de asesor.', 403));
  }
  next();
}

module.exports = verificarAsesor;
