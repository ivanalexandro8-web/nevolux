// src/routes/asesoriaRoutes.js
const router = require('express').Router();
const controller = require('../controllers/asesoriaController');
const verificarToken = require('../middlewares/verificarToken');

/**
 * @swagger
 * tags:
 *   name: Asesorias
 *   description: Sesiones de asesoria activas
 */

/**
 * @swagger
 * /api/asesorias/{solicitudId}/finalizar:
 *   put:
 *     summary: Finalizar una asesoria activa
 *     tags: [Asesorias]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: solicitudId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: OK }
 */
router.put('/:solicitudId/finalizar', verificarToken, controller.finalizar);

module.exports = router;
