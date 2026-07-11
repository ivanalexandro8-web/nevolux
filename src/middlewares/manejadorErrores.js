// src/middlewares/manejadorErrores.js
// Middleware global de errores. Se registra al final de app.js.
const AppError = require('../utils/AppError');

function manejadorErrores(err, req, res, next) {
  // Errores de negocio que nosotros mismos lanzamos (controlados)
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ ok: false, mensaje: err.message });
  }

  // Duplicado en MySQL (correo, matricula, etc.)
  if (err.code === 'ER_DUP_ENTRY') {
    return res.status(409).json({ ok: false, mensaje: 'Ya existe un registro con esos datos (correo o matricula duplicados).' });
  }

  // Cualquier otro error: nunca se expone el detalle crudo de MySQL al cliente
  console.error('[ERROR NO CONTROLADO]', err);
  return res.status(500).json({ ok: false, mensaje: 'Error interno del servidor.' });
}

module.exports = manejadorErrores;
