-- ============================================
-- NEVOLUX - Esquema de base de datos MySQL
-- ============================================
CREATE DATABASE IF NOT EXISTS nevolux CHARACTER SET utf8mb4;
USE nevolux;

-- Tabla base de usuarios (los 3 roles viven aqui)
CREATE TABLE usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  apellido_paterno VARCHAR(100) NOT NULL,
  apellido_materno VARCHAR(100) NOT NULL,
  fecha_nacimiento DATE NOT NULL,
  correo VARCHAR(150) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  rol ENUM('admin','asesor','estudiante') NOT NULL,
  foto_perfil VARCHAR(255) DEFAULT NULL,
  activo BOOLEAN DEFAULT TRUE,
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Datos especificos de estudiante
CREATE TABLE estudiantes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL UNIQUE,
  matricula VARCHAR(20) NOT NULL UNIQUE,
  cuatrimestre TINYINT NOT NULL CHECK (cuatrimestre BETWEEN 1 AND 10),
  carrera ENUM('Desarrollo de Software','Redes Digitales') NOT NULL,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Datos especificos de asesor
CREATE TABLE asesores (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL UNIQUE,
  matricula VARCHAR(20) NOT NULL UNIQUE,
  cuatrimestre TINYINT NOT NULL CHECK (cuatrimestre BETWEEN 4 AND 10),
  curriculum TEXT NOT NULL,
  estatus_general ENUM('pendiente','aprobado','rechazado') DEFAULT 'pendiente',
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Catalogo fijo de materias
CREATE TABLE materias (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL UNIQUE
) ENGINE=InnoDB;

-- Relacion asesor-materia (maximo 2 por asesor, validado en el service)
CREATE TABLE asesor_materia (
  id INT AUTO_INCREMENT PRIMARY KEY,
  asesor_id INT NOT NULL,
  materia_id INT NOT NULL,
  estatus ENUM('pendiente','aprobado','rechazado') DEFAULT 'pendiente',
  fecha_bloqueo_hasta DATE DEFAULT NULL,
  FOREIGN KEY (asesor_id) REFERENCES asesores(id) ON DELETE CASCADE,
  FOREIGN KEY (materia_id) REFERENCES materias(id) ON DELETE CASCADE,
  UNIQUE KEY unico_asesor_materia (asesor_id, materia_id)
) ENGINE=InnoDB;

-- Examenes por materia
CREATE TABLE examenes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  materia_id INT NOT NULL,
  duracion_minutos INT DEFAULT 10,
  num_preguntas INT DEFAULT 25,
  puntaje_minimo_aprobatorio INT DEFAULT 80,
  FOREIGN KEY (materia_id) REFERENCES materias(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Banco de preguntas
CREATE TABLE preguntas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  examen_id INT NOT NULL,
  texto TEXT NOT NULL,
  opcion_a VARCHAR(255) NOT NULL,
  opcion_b VARCHAR(255) NOT NULL,
  opcion_c VARCHAR(255) NOT NULL,
  opcion_d VARCHAR(255) NOT NULL,
  respuesta_correcta ENUM('A','B','C','D') NOT NULL,
  FOREIGN KEY (examen_id) REFERENCES examenes(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Intentos de examen realizados por asesores
CREATE TABLE intentos_examen (
  id INT AUTO_INCREMENT PRIMARY KEY,
  asesor_id INT NOT NULL,
  examen_id INT NOT NULL,
  materia_id INT NOT NULL,
  respuestas JSON NOT NULL,
  puntaje DECIMAL(5,2) NOT NULL,
  resultado ENUM('aprobado','reprobado') NOT NULL,
  fecha_inicio TIMESTAMP NOT NULL,
  fecha_fin TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (asesor_id) REFERENCES asesores(id) ON DELETE CASCADE,
  FOREIGN KEY (examen_id) REFERENCES examenes(id) ON DELETE CASCADE,
  FOREIGN KEY (materia_id) REFERENCES materias(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Horarios disponibles del asesor
CREATE TABLE horarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  asesor_id INT NOT NULL,
  dia_semana ENUM('Lunes','Martes','Miercoles','Jueves','Viernes','Sabado') NOT NULL,
  hora_inicio TIME NOT NULL,
  hora_fin TIME NOT NULL,
  FOREIGN KEY (asesor_id) REFERENCES asesores(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Solicitudes de asesoria del estudiante hacia el asesor
CREATE TABLE solicitudes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  estudiante_id INT NOT NULL,
  asesor_id INT NOT NULL,
  materia_id INT NOT NULL,
  estatus ENUM('pendiente','aceptada','rechazada','cancelada') DEFAULT 'pendiente',
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (estudiante_id) REFERENCES estudiantes(id) ON DELETE CASCADE,
  FOREIGN KEY (asesor_id) REFERENCES asesores(id) ON DELETE CASCADE,
  FOREIGN KEY (materia_id) REFERENCES materias(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Asesoria activa (se crea cuando el asesor acepta la solicitud)
CREATE TABLE asesorias (
  id INT AUTO_INCREMENT PRIMARY KEY,
  solicitud_id INT NOT NULL UNIQUE,
  estatus ENUM('activa','finalizada','cancelada') DEFAULT 'activa',
  fecha_inicio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  fecha_fin TIMESTAMP NULL,
  FOREIGN KEY (solicitud_id) REFERENCES solicitudes(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Chat entre estudiante y asesor dentro de una solicitud/asesoria
CREATE TABLE mensajes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  solicitud_id INT NOT NULL,
  emisor_id INT NOT NULL,
  texto TEXT NOT NULL,
  enviado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (solicitud_id) REFERENCES solicitudes(id) ON DELETE CASCADE,
  FOREIGN KEY (emisor_id) REFERENCES usuarios(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Quejas y sugerencias hacia el administrador
CREATE TABLE quejas_sugerencias (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  tipo ENUM('queja','sugerencia') NOT NULL,
  mensaje TEXT NOT NULL,
  estatus ENUM('pendiente','atendida') DEFAULT 'pendiente',
  respuesta_admin TEXT DEFAULT NULL,
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
) ENGINE=InnoDB;
