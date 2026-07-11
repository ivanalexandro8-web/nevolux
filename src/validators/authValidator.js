// src/validators/authValidator.js
const { body } = require('express-validator');

const dominio = process.env.DOMINIO_PERMITIDO || 'alumno.utpuebla.edu.mx';

const validarCorreoInstitucional = body('correo')
  .isEmail().withMessage('Correo invalido.')
  .custom((valor) => {
    if (!valor.toLowerCase().endsWith('@' + dominio)) {
      throw new Error(`El correo debe pertenecer al dominio @${dominio}`);
    }
    return true;
  });

const camposComunesRegistro = [
  body('nombre').trim().notEmpty().withMessage('El nombre es obligatorio.'),
  body('apellido_paterno').trim().notEmpty().withMessage('El apellido paterno es obligatorio.'),
  body('apellido_materno').trim().notEmpty().withMessage('El apellido materno es obligatorio.'),
  body('fecha_nacimiento').isDate().withMessage('Fecha de nacimiento invalida.'),
  body('matricula').trim().notEmpty().withMessage('La matricula es obligatoria.'),
  body('cuatrimestre').isInt({ min: 1, max: 10 }).withMessage('El cuatrimestre debe estar entre 1 y 10.'),
  validarCorreoInstitucional,
  body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres.'),
  body('confirmar_password').custom((valor, { req }) => {
    if (valor !== req.body.password) {
      throw new Error('Las contraseñas no coinciden.');
    }
    return true;
  })
];

const registroEstudianteValidator = [
  ...camposComunesRegistro,
  body('carrera').isIn(['Desarrollo de Software', 'Redes Digitales']).withMessage('Carrera invalida.')
];

const registroAsesorValidator = [
  ...camposComunesRegistro,
  body('cuatrimestre').isInt({ min: 4, max: 10 }).withMessage('Solo pueden registrarse como asesor estudiantes de 4to cuatrimestre en adelante.'),
  body('materia_id').isInt().withMessage('Debes elegir una materia para impartir.'),
  body('curriculum').trim().notEmpty().withMessage('El curriculum es obligatorio.')
];

const loginValidator = [
  body('correo').isEmail().withMessage('Correo invalido.'),
  body('password').notEmpty().withMessage('La contraseña es obligatoria.')
];

module.exports = { registroEstudianteValidator, registroAsesorValidator, loginValidator };
