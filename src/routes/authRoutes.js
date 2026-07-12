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
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *               - apellido_paterno
 *               - apellido_materno
 *               - fecha_nacimiento
 *               - matricula
 *               - cuatrimestre
 *               - correo
 *               - password
 *               - confirmar_password
 *               - carrera
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: Juan
 *               apellido_paterno:
 *                 type: string
 *                 example: Perez
 *               apellido_materno:
 *                 type: string
 *                 example: Lopez
 *               fecha_nacimiento:
 *                 type: string
 *                 example: 2003-05-10
 *               matricula:
 *                 type: string
 *                 example: 0139801
 *               cuatrimestre:
 *                 type: integer
 *                 example: 3
 *               correo:
 *                 type: string
 *                 example: juan.perez@alumno.utpuebla.edu.mx
 *               password:
 *                 type: string
 *                 example: clave123
 *               confirmar_password:
 *                 type: string
 *                 example: clave123
 *               carrera:
 *                 type: string
 *                 example: Desarrollo de Software
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
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *               - apellido_paterno
 *               - apellido_materno
 *               - fecha_nacimiento
 *               - matricula
 *               - cuatrimestre
 *               - correo
 *               - password
 *               - confirmar_password
 *               - materia_id
 *               - curriculum
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: Ana
 *               apellido_paterno:
 *                 type: string
 *                 example: Garcia
 *               apellido_materno:
 *                 type: string
 *                 example: Torres
 *               fecha_nacimiento:
 *                 type: string
 *                 example: 2002-03-15
 *               matricula:
 *                 type: string
 *                 example: 0139802
 *               cuatrimestre:
 *                 type: integer
 *                 example: 6
 *               correo:
 *                 type: string
 *                 example: ana.garcia@alumno.utpuebla.edu.mx
 *               password:
 *                 type: string
 *                 example: clave123
 *               confirmar_password:
 *                 type: string
 *                 example: clave123
 *               materia_id:
 *                 type: integer
 *                 example: 1
 *               curriculum:
 *                 type: string
 *                 example: Experiencia en programacion web y bases de datos.
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
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - correo
 *               - password
 *             properties:
 *               correo:
 *                 type: string
 *                 example: utp0139797@alumno.utpuebla.edu.mx
 *               password:
 *                 type: string
 *                 example: pato123#
 *     responses:
 *       200:
 *         description: Login exitoso, retorna token JWT
 */
router.post('/login', loginValidator, authController.login);

module.exports = router;