// src/seedAdmin.js
// Crea la cuenta de administrador por defecto si no existe.
// El admin NUNCA se registra desde un formulario publico (requisito del proyecto).
const bcrypt = require('bcryptjs');
const pool = require('./config/db');

async function seedAdmin() {
  const [rows] = await pool.query('SELECT id FROM usuarios WHERE correo = ?', [process.env.ADMIN_EMAIL]);
  if (rows.length > 0) return;

  const hash = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
  await pool.query(
    `INSERT INTO usuarios (nombre, apellido_paterno, apellido_materno, fecha_nacimiento, correo, password_hash, rol)
     VALUES (?, 'Administrador', 'NEVOLUX', '2000-01-01', ?, ?, 'admin')`,
    [process.env.ADMIN_NOMBRE || 'Administrador', process.env.ADMIN_EMAIL, hash]
  );
  console.log(`[SEED] Cuenta de administrador creada: ${process.env.ADMIN_EMAIL}`);
}

module.exports = seedAdmin;
