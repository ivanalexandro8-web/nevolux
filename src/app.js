// src/app.js
const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');
const manejadorErrores = require('./middlewares/manejadorErrores');

const authRoutes = require('./routes/authRoutes');
const estudianteRoutes = require('./routes/estudianteRoutes');
const asesorRoutes = require('./routes/asesorRoutes');
const adminRoutes = require('./routes/adminRoutes');
const materiaRoutes = require('./routes/materiaRoutes');
const examenRoutes = require('./routes/examenRoutes');
const solicitudRoutes = require('./routes/solicitudRoutes');
const asesoriaRoutes = require('./routes/asesoriaRoutes');
const chatRoutes = require('./routes/chatRoutes');
const quejaRoutes = require('./routes/quejaRoutes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

// Documentacion interactiva -> /api-docs (equivalente al /docs de FastAPI)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api/auth', authRoutes);
app.use('/api/estudiantes', estudianteRoutes);
app.use('/api/asesores', asesorRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/materias', materiaRoutes);
app.use('/api/examenes', examenRoutes);
app.use('/api/solicitudes', solicitudRoutes);
app.use('/api/asesorias', asesoriaRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/quejas', quejaRoutes);

app.get('/api', (req, res) => {
  res.json({ ok: true, mensaje: 'API de NEVOLUX funcionando.' });
});

// Middleware de errores SIEMPRE al final
app.use(manejadorErrores);

module.exports = app;
