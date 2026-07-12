// src/routes/solicitudRoutes.js
const router = require('express').Router();
const controller = require('../controllers/solicitudController');
const verificarToken = require('../middlewares/verificarToken');
const verificarEstudiante = require('../middlewares/verificarEstudiante');
const verificarAsesor = require('../middlewares/verificarAsesor');
router.use(verificarToken);
/**
 * @swagger
 * tags:
 *   name: Solicitudes
 *   description: Solicitudes de asesoria entre estudiante y asesor
 */
/**
 * @swagger
 * /api/solicitudes:
 *   post:
 *     summary: Crear una solicitud de asesoria (estudiante)
 *     tags: [Solicitudes]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - asesor_id
 *               - materia_id
 *             properties:
 *               asesor_id:
 *                 type: integer
 *                 example: 1
 *               materia_id:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201: { description: Creada }
 */
router.post('/', verificarEstudiante, controller.crear);
/**
 * @swagger
 * /api/solicitudes/estudiante:
 *   get:
 *     summary: Listar mis solicitudes (estudiante)
 *     tags: [Solicitudes]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: OK }
 */
router.get('/estudiante', verificarEstudiante, controller.misSolicitudesEstudiante);
/**
 * @swagger
 * /api/solicitudes/asesor:
 *   get:
 *     summary: Listar mis solicitudes recibidas (asesor)
 *     tags: [Solicitudes]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: OK }
 */
router.get('/asesor', verificarAsesor, controller.misSolicitudesAsesor);
/**
 * @swagger
 * /api/solicitudes/{id}/responder:
 *   put:
 *     summary: Aceptar o rechazar una solicitud (asesor)
 *     tags: [Solicitudes]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - aceptar
 *             properties:
 *               aceptar:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200: { description: OK }
 */
router.put('/:id/responder', verificarAsesor, controller.responder);
/**
 * @swagger
 * /api/solicitudes/{id}/cancelar:
 *   put:
 *     summary: Cancelar una solicitud (estudiante o asesor)
 *     tags: [Solicitudes]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: OK }
 */
router.put('/:id/cancelar', controller.cancelar);
module.exports = router;