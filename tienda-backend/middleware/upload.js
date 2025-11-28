const multer = require('multer');
const path = require('path');

// Configuración del almacenamiento
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  }
});

// Validar solo imágenes
const fileFilter = (req, file, cb) => {
  const tipos = /jpg|jpeg|png|webp/;
  const ext = tipos.test(path.extname(file.originalname).toLowerCase());
  const mime = tipos.test(file.mimetype);

  if (ext && mime) cb(null, true);
  else cb(new Error('Solo se permiten imágenes'), false);
};

module.exports = multer({ storage, fileFilter });
