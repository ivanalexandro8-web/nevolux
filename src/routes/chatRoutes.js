// src/routes/chatRoutes.js
const router = require('express').Router();
const controller = require('../controllers/chatController');
const verificarToken = require('../middlewares/verificarToken');

router.use(verificarToken);

/**
 * @swagger
 * tags:
 *   name: Chat
 *   description: Mensajeria entre estudiante y asesor
 */

/**
 * @swagger
 * /api/chat/{solicitudId}/mensajes:
 *   get:
 *     summary: Listar mensajes de una conversacion
 *     tags: [Chat]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: solicitudId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: OK }
 */
router.get('/:solicitudId/mensajes', controller.listar);

/**
 * @swagger
 * /api/chat/{solicitudId}/mensajes:
 *   post:
 *     summary: Enviar un mensaje
 *     tags: [Chat]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: solicitudId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       201: { description: Enviado }
 */
router.post('/:solicitudId/mensajes', controller.enviar);

module.exports = router;
