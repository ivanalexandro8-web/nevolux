// src/controllers/estudianteController.js
const estudianteService = require('../services/estudianteService');

async function miPerfil(req, res, next) {
  try {
    const perfil = await estudianteService.obtenerPerfil(req.usuario.id);
    res.json({ ok: true, data: perfil });
  } catch (err) { next(err); }
}

async function actualizarPerfil(req, res, next) {
  try {
    const perfil = await estudianteService.actualizarPerfil(req.usuario.id, req.body);
    res.json({ ok: true, mensaje: 'Perfil actualizado.', data: perfil });
  } catch (err) { next(err); }
}

async function cambiarPassword(req, res, next) {
  try {
    await estudianteService.cambiarPassword(req.usuario.id, req.body.password_actual, req.body.password_nueva);
    res.json({ ok: true, mensaje: 'Contraseña actualizada correctamente.' });
  } catch (err) { next(err); }
}

async function buscarAsesores(req, res, next) {
  try {
    const asesores = await estudianteService.buscarAsesoresPorMateria(req.params.materiaId);
    res.json({ ok: true, data: asesores });
  } catch (err) { next(err); }
}

async function subirFoto(req, res, next) {
  try {
    if (!req.file) throw new (require('../utils/AppError'))('No se recibio ninguna imagen.', 400);
    const rutaPublica = `/uploads/${req.file.filename}`;
    const perfil = await estudianteService.actualizarPerfil(req.usuario.id, { foto_perfil: rutaPublica });
    res.json({ ok: true, mensaje: 'Foto de perfil actualizada.', data: perfil });
  } catch (err) { next(err); }
}

module.exports = { miPerfil, actualizarPerfil, cambiarPassword, buscarAsesores, subirFoto };
