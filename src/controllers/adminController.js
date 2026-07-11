// src/controllers/adminController.js
const adminService = require('../services/adminService');

async function listarEstudiantes(req, res, next) {
  try {
    const data = await adminService.listarEstudiantes();
    res.json({ ok: true, data });
  } catch (err) { next(err); }
}

async function listarAsesores(req, res, next) {
  try {
    const data = await adminService.listarAsesores();
    res.json({ ok: true, data });
  } catch (err) { next(err); }
}

async function eliminarCuenta(req, res, next) {
  try {
    await adminService.eliminarCuenta(req.params.id);
    res.json({ ok: true, mensaje: 'Cuenta eliminada.' });
  } catch (err) { next(err); }
}

async function restablecerPassword(req, res, next) {
  try {
    await adminService.restablecerPassword(req.params.id, req.body.password_nueva);
    res.json({ ok: true, mensaje: 'Contraseña restablecida.' });
  } catch (err) { next(err); }
}

async function revisarSolicitudAsesor(req, res, next) {
  try {
    await adminService.revisarSolicitudAsesor(req.params.asesorMateriaId, req.body.aprobar === true);
    res.json({ ok: true, mensaje: 'Revision aplicada.' });
  } catch (err) { next(err); }
}

module.exports = { listarEstudiantes, listarAsesores, eliminarCuenta, restablecerPassword, revisarSolicitudAsesor };
