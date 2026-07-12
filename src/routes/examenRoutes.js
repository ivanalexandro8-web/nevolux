// src/routes/examenRoutes.js
const router = require('express').Router();
const controller = require('../controllers/examenController');
const verificarToken = require('../middlewares/verificarToken');
const verificarAsesor = require('../middlewares/verificarAsesor');
router.use(verificarToken, verificarAsesor);
/**
 * @swagger
 * tags:
 *   name: Examenes
 *   description: Examen de certificacion de asesores (25 preguntas, 10 minutos)
 */
/**
 * @swagger
 * /api/examenes/iniciar:
 *   post:
 *     summary: Iniciar el examen de una materia
 *     tags: [Examenes]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - materia_id
 *             properties:
 *               materia_id:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200: { description: Preguntas del examen }
 */
router.post('/iniciar', controller.iniciar);
/**
 * @swagger
 * /api/examenes/responder:
 *   post:
 *     summary: Enviar las respuestas del examen para calificacion
 *     tags: [Examenes]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - examen_id
 *               - materia_id
 *               - fecha_inicio
 *               - respuestas
 *             properties:
 *               examen_id:
 *                 type: integer
 *                 example: 1
 *               materia_id:
 *                 type: integer
 *                 example: 1
 *               fecha_inicio:
 *                 type: string
 *                 example: 2026-07-12T10:00:00.000Z
 *               respuestas:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     pregunta_id:
 *                       type: integer
 *                       example: 1
 *                     opcion:
 *                       type: string
 *                       example: A
 *     responses:
 *       200: { description: Resultado del examen }
 */
router.post('/responder', controller.responder);
module.exports = router;