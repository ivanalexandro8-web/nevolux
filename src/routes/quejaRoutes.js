// src/routes/quejaRoutes.js
const router = require('express').Router();
const controller = require('../controllers/quejaController');
const verificarToken = require('../middlewares/verificarToken');
const verificarAdmin = require('../middlewares/verificarAdmin');
/**
 * @swagger
 * tags:
 *   name: Quejas y Sugerencias
 *   description: Comunicacion de estudiantes/asesores hacia el administrador
 */
/**
 * @swagger
 * /api/quejas:
 *   post:
 *     summary: Enviar una queja o sugerencia
 *     tags: [Quejas y Sugerencias]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - tipo
 *               - mensaje
 *             properties:
 *               tipo:
 *                 type: string
 *                 example: queja
 *               mensaje:
 *                 type: string
 *                 example: Tuve un problema al agendar una asesoria.
 *     responses:
 *       201: { description: Enviada }
 */
router.post('/', verificarToken, controller.crear);
/**
 * @swagger
 * /api/quejas:
 *   get:
 *     summary: Listar todas las quejas/sugerencias (admin)
 *     tags: [Quejas y Sugerencias]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: OK }
 */
router.get('/', verificarToken, verificarAdmin, controller.listar);
/**
 * @swagger
 * /api/quejas/{id}/responder:
 *   put:
 *     summary: Responder una queja/sugerencia (admin)
 *     tags: [Quejas y Sugerencias]
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
 *               - respuesta
 *             properties:
 *               respuesta:
 *                 type: string
 *                 example: Gracias por tu comentario, ya fue atendido.
 *     responses:
 *       200: { description: OK }
 */
router.put('/:id/responder', verificarToken, verificarAdmin, controller.responder);
module.exports = router;