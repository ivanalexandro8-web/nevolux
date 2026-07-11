// src/services/mailService.js
const transporter = require('../config/mailer');
const usuarioModel = require('../models/usuarioModel');
const asesorModel = require('../models/asesorModel');
const materiaModel = require('../models/materiaModel');

async function enviar(destinatario, asunto, texto) {
  try {
    await transporter.sendMail({
      from: process.env.MAIL_USER,
      to: destinatario,
      subject: asunto,
      text
    });
  } catch (err) {
    // No tumbamos el flujo de la app si falla el correo, solo se registra
    console.error('[MAIL] No se pudo enviar el correo:', err.message);
  }
}

async function notificarResultadoExamen(asesorId, materiaId, resultado) {
  const asesor = await asesorModel.buscarPorId(asesorId);
  const usuario = await usuarioModel.buscarPorId(asesor.usuario_id);
  const materia = await materiaModel.buscarPorId(materiaId);

  if (resultado === 'aprobado') {
    await enviar(
      usuario.correo,
      'NEVOLUX - Examen aprobado',
      `Felicidades, has sido aprobado satisfactoriamente para impartir asesorias de ${materia.nombre}. Ya puedes ingresar a tu perfil de asesor.`
    );
  } else {
    await enviar(
      usuario.correo,
      'NEVOLUX - Resultado de examen',
      `Lo sentimos, tu peticion ha sido denegada. No alcanzaste el puntaje necesario para aprobar el examen de ${materia.nombre}. Podras volver a intentarlo despues de que termine el cuatrimestre actual.`
    );
  }
}

async function notificarSolicitudAceptada(estudianteCorreo, asesorNombre, materiaNombre) {
  await enviar(
    estudianteCorreo,
    'NEVOLUX - Solicitud aceptada',
    `Tu solicitud de asesoria de ${materiaNombre} con ${asesorNombre} fue aceptada. Ya puedes chatear para ponerse de acuerdo.`
  );
}

module.exports = { enviar, notificarResultadoExamen, notificarSolicitudAceptada };
