// src/routes/estudianteRoutes.js
const router = require('express').Router();
const controller = require('../controllers/estudianteController');
const verificarToken = require('../middlewares/verificarToken');
const verificarEstudiante = require('../middlewares/verificarEstudiante');
const upload = require('../middlewares/upload');
router.use(verificarToken, verificarEstudiante);
/**
 * @swagger
 * tags:
 *   name: Estudiantes
 *   description: Perfil y busqueda de asesores
 */
/**
 * @swagger
 * /api/estudiantes/perfil:
 *   get:
 *     summary: Obtener mi perfil de estudiante
 *     tags: [Estudiantes]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: OK }
 */
router.get('/perfil', controller.miPerfil);
/**
 * @swagger
 * /api/estudiantes/perfil:
 *   put:
 *     summary: Actualizar mis datos
 *     tags: [Estudiantes]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
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
 *               cuatrimestre:
 *                 type: integer
 *                 example: 5
 *               carrera:
 *                 type: string
 *                 example: Desarrollo de Software
 *     responses:
 *       200: { description: OK }
 */
router.put('/perfil', controller.actualizarPerfil);
/**
 * @swagger
 * /api/estudiantes/password:
 *   put:
 *     summary: Cambiar mi contraseña
 *     tags: [Estudiantes]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - password_actual
 *               - password_nueva
 *             properties:
 *               password_actual:
 *                 type: string
 *                 example: clave123
 *               password_nueva:
 *                 type: string
 *                 example: claveNueva456
 *     responses:
 *       200: { description: OK }
 */
router.put('/password', controller.cambiarPassword);
/**
 * @swagger
 * /api/estudiantes/asesores/{materiaId}:
 *   get:
 *     summary: Buscar asesores aprobados de una materia
 *     tags: [Estudiantes]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: materiaId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: OK }
 */
router.get('/asesores/:materiaId', controller.buscarAsesores);
/**
 * @swagger
 * /api/estudiantes/foto:
 *   post:
 *     summary: Subir foto de perfil
 *     tags: [Estudiantes]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               foto: { type: string, format: binary }
 *     responses:
 *       200: { description: OK }
 */
router.post('/foto', upload.single('foto'), controller.subirFoto);
module.exports = router;