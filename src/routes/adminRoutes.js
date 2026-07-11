// src/routes/adminRoutes.js
const router = require('express').Router();
const controller = require('../controllers/adminController');
const verificarToken = require('../middlewares/verificarToken');
const verificarAdmin = require('../middlewares/verificarAdmin');

router.use(verificarToken, verificarAdmin);

/**
 * @swagger
 * tags:
 *   name: Administrador
 *   description: Gestion de cuentas, revisiones y soporte
 */

/**
 * @swagger
 * /api/admin/estudiantes:
 *   get:
 *     summary: Listar todos los estudiantes
 *     tags: [Administrador]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: OK }
 */
router.get('/estudiantes', controller.listarEstudiantes);

/**
 * @swagger
 * /api/admin/asesores:
 *   get:
 *     summary: Listar todos los asesores
 *     tags: [Administrador]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: OK }
 */
router.get('/asesores', controller.listarAsesores);

/**
 * @swagger
 * /api/admin/cuentas/{id}:
 *   delete:
 *     summary: Eliminar la cuenta de un usuario
 *     tags: [Administrador]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: OK }
 */
router.delete('/cuentas/:id', controller.eliminarCuenta);

/**
 * @swagger
 * /api/admin/cuentas/{id}/password:
 *   put:
 *     summary: Restablecer la contraseña de un usuario
 *     tags: [Administrador]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: OK }
 */
router.put('/cuentas/:id/password', controller.restablecerPassword);

/**
 * @swagger
 * /api/admin/asesor-materia/{asesorMateriaId}/revisar:
 *   put:
 *     summary: Revisar manualmente una postulacion de asesor a una materia
 *     tags: [Administrador]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: asesorMateriaId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: OK }
 */
router.put('/asesor-materia/:asesorMateriaId/revisar', controller.revisarSolicitudAsesor);

module.exports = router;
