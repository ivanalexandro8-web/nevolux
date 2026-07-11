// src/middlewares/upload.js
// Multer para subir foto de perfil (estudiante y asesor). Se guarda en /uploads.
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const nombreUnico = `${req.usuario.id}-${Date.now()}${path.extname(file.originalname)}`;
    cb(null, nombreUnico);
  }
});

function filtroImagen(req, file, cb) {
  const permitidos = /jpeg|jpg|png|webp/;
  const extOk = permitidos.test(path.extname(file.originalname).toLowerCase());
  const mimeOk = permitidos.test(file.mimetype);
  if (extOk && mimeOk) return cb(null, true);
  cb(new Error('Solo se permiten imagenes jpg, jpeg, png o webp.'));
}

const upload = multer({ storage, fileFilter: filtroImagen, limits: { fileSize: 3 * 1024 * 1024 } });

module.exports = upload;
