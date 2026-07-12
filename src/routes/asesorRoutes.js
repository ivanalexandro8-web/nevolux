// src/routes/asesorRoutes.js
const router = require('express').Router();
const controller = require('../controllers/asesorController');
const verificarToken = require('../middlewares/verificarToken');
const verificarAsesor = require('../middlewares/verificarAsesor');
const upload = require('../middlewares/upload');
router.use(verificarToken, verificarAsesor);
/**
 * @swagger
 * tags:
 *   name: Asesores
 *   description: Perfil, horarios y postulacion a materias
 */
/**
 * @swagger
 * /api/asesores/perfil:
 *   get:
 *     summary: Obtener mi perfil de asesor
 *     tags: [Asesores]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: OK }
 */
router.get('/perfil', controller.miPerfil);
/**
 * @swagger
 * /api/asesores/perfil:
 *   put:
 *     summary: Actualizar mis datos
 *     tags: [Asesores]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
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
 *               curriculum:
 *                 type: string
 *                 example: Experiencia en desarrollo web.
 *     responses:
 *       200: { description: OK }
 */
router.put('/perfil', controller.actualizarPerfil);
/**
 * @swagger
 * /api/asesores/password:
 *   put:
 *     summary: Cambiar mi contraseña
 *     tags: [Asesores]
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
 * /api/asesores/horarios:
 *   post:
 *     summary: Agregar un horario disponible
 *     tags: [Asesores]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - dia_semana
 *               - hora_inicio
 *               - hora_fin
 *             properties:
 *               dia_semana:
 *                 type: string
 *                 example: lunes
 *               hora_inicio:
 *                 type: string
 *                 example: "10:00"
 *               hora_fin:
 *                 type: string
 *                 example: "12:00"
 *     responses:
 *       201: { description: Creado }
 */
router.post('/horarios', controller.agregarHorario);
/**
 * @swagger
 * /api/asesores/horarios/{id}:
 *   put:
 *     summary: Actualizar un horario
 *     tags: [Asesores]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               dia_semana:
 *                 type: string
 *                 example: martes
 *               hora_inicio:
 *                 type: string
 *                 example: "10:00"
 *               hora_fin:
 *                 type: string
 *                 example: "12:00"
 *     responses:
 *       200: { description: OK }
 */
router.put('/horarios/:id', controller.actualizarHorario);
/**
 * @swagger
 * /api/asesores/horarios/{id}:
 *   delete:
 *     summary: Eliminar un horario
 *     tags: [Asesores]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: OK }
 */
router.delete('/horarios/:id', controller.eliminarHorario);
/**
 * @swagger
 * /api/asesores/segunda-materia:
 *   post:
 *     summary: Postularse para impartir una segunda materia (maximo 2)
 *     tags: [Asesores]
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
 *                 example: 2
 *     responses:
 *       201: { description: Postulacion registrada }
 */
router.post('/segunda-materia', controller.postularSegundaMateria);
/**
 * @swagger
 * /api/asesores/foto:
 *   post:
 *     summary: Subir foto de perfil
 *     tags: [Asesores]
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