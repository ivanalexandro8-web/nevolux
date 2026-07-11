// src/models/preguntaModel.js
const pool = require('../config/db');

// Trae N preguntas aleatorias de un examen (para no repetir siempre las mismas)
async function obtenerAleatorias(examenId, cantidad) {
  const [rows] = await pool.query(
    'SELECT id, texto, opcion_a, opcion_b, opcion_c, opcion_d FROM preguntas WHERE examen_id = ? ORDER BY RAND() LIMIT ?',
    [examenId, cantidad]
  );
  return rows;
}

// Trae las respuestas correctas de un set de preguntas (para calificar, nunca se manda al frontend)
async function obtenerRespuestasCorrectas(idsPreguntas) {
  if (idsPreguntas.length === 0) return [];
  const [rows] = await pool.query(
    `SELECT id, respuesta_correcta FROM preguntas WHERE id IN (${idsPreguntas.map(() => '?').join(',')})`,
    idsPreguntas
  );
  return rows;
}

module.exports = { obtenerAleatorias, obtenerRespuestasCorrectas };
