-- Catalogo fijo de materias que pide el proyecto
USE nevolux;

INSERT INTO materias (nombre) VALUES
  ('Calculo'),
  ('Programacion'),
  ('Bases de Datos'),
  ('Fundamentos de Redes');

-- Un examen por materia (25 preguntas, 10 minutos, 80% para aprobar)
INSERT INTO examenes (materia_id, duracion_minutos, num_preguntas, puntaje_minimo_aprobatorio)
SELECT id, 10, 25, 80 FROM materias;

-- NOTA: aqui debes cargar el banco real de preguntas (25 o mas por materia).
-- Ejemplo de una pregunta para Programacion:
-- INSERT INTO preguntas (examen_id, texto, opcion_a, opcion_b, opcion_c, opcion_d, respuesta_correcta)
-- VALUES (2, '¿Que estructura usa LIFO?', 'Cola', 'Pila', 'Arbol', 'Grafo', 'B');
