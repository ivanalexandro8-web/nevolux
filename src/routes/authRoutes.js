// src/routes/authRoutes.js
const router = require('express').Router();
const authController = require('../controllers/authController');
const { registroEstudianteValidator, registroAsesorValidator, loginValidator } = require('../validators/authValidator');

/**
 * @swagger
 * tags:
 *   name: Autenticacion
 *   description: Registro y login de usuarios
 */

/**
 * @swagger
 * /api/auth/registro/estudiante:
 *   post:
 *     summary: Registrar un nuevo estudiante
 *     tags: [Autenticacion]
 *     requestBody:
 *       required: true
 *     responses:
 *       201:
 *         description: Registro exitoso
 */
router.post('/registro/estudiante', registroEstudianteValidator, authController.registroEstudiante);

/**
 * @swagger
 * /api/auth/registro/asesor:
 *   post:
 *     summary: Registrar un nuevo asesor (cuatrimestre >= 4)
 *     tags: [Autenticacion]
 *     requestBody:
 *       required: true
 *     responses:
 *       201:
 *         description: Registro recibido, debe presentar examen
 */
router.post('/registro/asesor', registroAsesorValidator, authController.registroAsesor);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Iniciar sesion (estudiante, asesor o administrador)
 *     tags: [Autenticacion]
 *     requestBody:
 *       required: true
 *     responses:
 *       200:
 *         description: Login exitoso, retorna token JWT
 */
router.post('/login', loginValidator, authController.login);

module.exports = router;
