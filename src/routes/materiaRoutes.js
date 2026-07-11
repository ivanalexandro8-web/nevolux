// src/routes/materiaRoutes.js
const router = require('express').Router();
const controller = require('../controllers/materiaController');
const verificarToken = require('../middlewares/verificarToken');

/**
 * @swagger
 * tags:
 *   name: Materias
 *   description: Catalogo de materias disponibles
 */

/**
 * @swagger
 * /api/materias:
 *   get:
 *     summary: Listar el catalogo de materias
 *     tags: [Materias]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: OK }
 */
router.get('/', verificarToken, controller.listar);

module.exports = router;
