// src/services/examenService.js
// Reglas: 25 preguntas, 10 minutos, se compara contra respuesta_correcta,
// si repruebas se bloquea esa materia 4 meses, si apruebas se notifica por correo.
const AppError = require('../utils/AppError');
const examenModel = require('../models/examenModel');
const preguntaModel = require('../models/preguntaModel');
const intentoModel = require('../models/intentoExamenModel');
const asesorMateriaModel = require('../models/asesorMateriaModel');
const asesorModel = require('../models/asesorModel');
const mailService = require('./mailService');

const CUATRO_MESES_MS = 1000 * 60 * 60 * 24 * 30 * 4;

async function iniciarExamen(asesorId, materiaId) {
  const relacion = await asesorMateriaModel.buscar(asesorId, materiaId);
  if (!relacion) throw new AppError('No tienes una solicitud registrada para esta materia.', 400);

  if (relacion.estatus === 'aprobado') {
    throw new AppError('Ya estas aprobado para impartir esta materia.', 400);
  }

  if (relacion.fecha_bloqueo_hasta && new Date(relacion.fecha_bloqueo_hasta) > new Date()) {
    throw new AppError(`Reprobaste este examen. Podras volver a presentarlo hasta el ${relacion.fecha_bloqueo_hasta}.`, 403);
  }

  const examen = await examenModel.buscarPorMateria(materiaId);
  if (!examen) throw new AppError('No hay examen configurado para esta materia todavia.', 404);

  const preguntas = await preguntaModel.obtenerAleatorias(examen.id, examen.num_preguntas);
  if (preguntas.length === 0) {
    throw new AppError('El banco de preguntas de esta materia esta vacio. Contacta al administrador.', 500);
  }

  return {
    examen_id: examen.id,
    materia_id: materiaId,
    duracion_minutos: examen.duracion_minutos,
    fecha_inicio: new Date().toISOString(),
    preguntas // sin respuesta_correcta, eso nunca se manda al frontend
  };
}

async function responderExamen(asesorId, datos) {
  // datos: { examen_id, materia_id, fecha_inicio, respuestas: [{pregunta_id, opcion}] }
  const examen = await examenModel.buscarPorMateria(datos.materia_id);
  if (!examen || examen.id !== datos.examen_id) throw new AppError('Examen invalido.', 400);

  // Verifica que no se haya pasado del tiempo limite (con 30s de tolerancia por latencia)
  const inicio = new Date(datos.fecha_inicio).getTime();
  const limite = inicio + examen.duracion_minutos * 60 * 1000 + 30 * 1000;
  const tiempoAgotado = Date.now() > limite;

  const idsPreguntas = datos.respuestas.map((r) => r.pregunta_id);
  const correctas = await preguntaModel.obtenerRespuestasCorrectas(idsPreguntas);
  const mapaCorrectas = new Map(correctas.map((c) => [c.id, c.respuesta_correcta]));

  let aciertos = 0;
  datos.respuestas.forEach((r) => {
    if (mapaCorrectas.get(r.pregunta_id) === r.opcion) aciertos++;
  });

  const puntaje = Math.round((aciertos / idsPreguntas.length) * 100);
  const resultado = (!tiempoAgotado && puntaje >= examen.puntaje_minimo_aprobatorio) ? 'aprobado' : 'reprobado';

  await intentoModel.crear({
    asesor_id: asesorId,
    examen_id: examen.id,
    materia_id: datos.materia_id,
    respuestas: datos.respuestas,
    puntaje,
    resultado,
    fecha_inicio: datos.fecha_inicio
  });

  const relacion = await asesorMateriaModel.buscar(asesorId, datos.materia_id);

  if (resultado === 'aprobado') {
    await asesorMateriaModel.actualizarEstatus(relacion.id, 'aprobado', null);
    await asesorModel.actualizarEstatusGeneral(asesorId, 'aprobado');
    await mailService.notificarResultadoExamen(asesorId, datos.materia_id, 'aprobado');
  } else {
    const fechaBloqueo = new Date(Date.now() + CUATRO_MESES_MS).toISOString().slice(0, 10);
    await asesorMateriaModel.actualizarEstatus(relacion.id, 'rechazado', fechaBloqueo);
    await mailService.notificarResultadoExamen(asesorId, datos.materia_id, 'reprobado');
  }

  return { puntaje, resultado, tiempoAgotado };
}

// El asesor ya aprobado en una materia puede postularse a una segunda (maximo 2 en total)
async function postularSegundaMateria(asesorId, materiaId) {
  const totalActivas = await asesorMateriaModel.contarMateriasActivas(asesorId);
  if (totalActivas >= 2) {
    throw new AppError('Ya alcanzaste el maximo de 2 materias por asesor.', 400);
  }
  const yaExiste = await asesorMateriaModel.buscar(asesorId, materiaId);
  if (yaExiste) {
    throw new AppError('Ya tienes una postulacion registrada para esta materia.', 409);
  }

  const pool = require('../config/db');
  await asesorMateriaModel.crear(pool, asesorId, materiaId);
  return { asesorId, materiaId, estatus: 'pendiente' };
}

module.exports = { iniciarExamen, responderExamen, postularSegundaMateria };
