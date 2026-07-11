// src/middlewares/verificarAdmin.js
const AppError = require('../utils/AppError');

function verificarAdmin(req, res, next) {
  if (!req.usuario || req.usuario.rol !== 'admin') {
    return next(new AppError('Acceso restringido: se requiere rol de administrador.', 403));
  }
  next();
}

module.exports = verificarAdmin;
