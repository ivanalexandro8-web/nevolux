// server.js
require('dotenv').config();
const app = require('./src/app');
const seedAdmin = require('./src/seedAdmin');

const PORT = process.env.PORT || 4000;

async function iniciar() {
  try {
    await seedAdmin();
    app.listen(PORT, () => {
      console.log(`API de NEVOLUX funcionando en el puerto ${PORT}`);
      console.log(`Documentacion Swagger: http://localhost:${PORT}/api-docs`);
    });
  } catch (err) {
    console.error('No se pudo iniciar el servidor:', err.message);
    process.exit(1);
  }
}

iniciar();
