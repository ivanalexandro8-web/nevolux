// src/middlewares/verificarToken.js
const jwt = require('jsonwebtoken');
const AppError = require('../utils/AppError');

function verificarToken(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return next(new AppError('No se proporciono un token de acceso.', 401));
  }

  const token = header.split(' ')[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = payload; // { id, rol, correo }
    next();
  } catch (err) {
    next(new AppError('Token invalido o expirado.', 401));
  }
}

module.exports = verificarToken;
