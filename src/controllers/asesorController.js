// src/controllers/asesorController.js
const asesorService = require('../services/asesorService');
const examenService = require('../services/examenService');

async function miPerfil(req, res, next) {
  try {
    const perfil = await asesorService.obtenerPerfil(req.usuario.id);
    res.json({ ok: true, data: perfil });
  } catch (err) { next(err); }
}

async function actualizarPerfil(req, res, next) {
  try {
    const perfil = await asesorService.actualizarPerfil(req.usuario.id, req.body);
    res.json({ ok: true, mensaje: 'Perfil actualizado.', data: perfil });
  } catch (err) { next(err); }
}

async function cambiarPassword(req, res, next) {
  try {
    await asesorService.cambiarPassword(req.usuario.id, req.body.password_actual, req.body.password_nueva);
    res.json({ ok: true, mensaje: 'Contraseña actualizada correctamente.' });
  } catch (err) { next(err); }
}

async function agregarHorario(req, res, next) {
  try {
    const perfil = await asesorService.obtenerPerfil(req.usuario.id);
    const id = await asesorService.agregarHorario(perfil.id, req.body);
    res.status(201).json({ ok: true, mensaje: 'Horario agregado.', data: { id } });
  } catch (err) { next(err); }
}

async function actualizarHorario(req, res, next) {
  try {
    const perfil = await asesorService.obtenerPerfil(req.usuario.id);
    await asesorService.actualizarHorario(perfil.id, req.params.id, req.body);
    res.json({ ok: true, mensaje: 'Horario actualizado.' });
  } catch (err) { next(err); }
}

async function eliminarHorario(req, res, next) {
  try {
    const perfil = await asesorService.obtenerPerfil(req.usuario.id);
    await asesorService.eliminarHorario(perfil.id, req.params.id);
    res.json({ ok: true, mensaje: 'Horario eliminado.' });
  } catch (err) { next(err); }
}

async function postularSegundaMateria(req, res, next) {
  try {
    const perfil = await asesorService.obtenerPerfil(req.usuario.id);
    const resultado = await examenService.postularSegundaMateria(perfil.id, req.body.materia_id);
    res.status(201).json({ ok: true, mensaje: 'Postulacion registrada. Ya puedes presentar el examen.', data: resultado });
  } catch (err) { next(err); }
}

async function subirFoto(req, res, next) {
  try {
    if (!req.file) throw new (require('../utils/AppError'))('No se recibio ninguna imagen.', 400);
    const rutaPublica = `/uploads/${req.file.filename}`;
    const perfil = await asesorService.actualizarPerfil(req.usuario.id, { foto_perfil: rutaPublica });
    res.json({ ok: true, mensaje: 'Foto de perfil actualizada.', data: perfil });
  } catch (err) { next(err); }
}

module.exports = { miPerfil, actualizarPerfil, cambiarPassword, agregarHorario, actualizarHorario, eliminarHorario, postularSegundaMateria, subirFoto };
