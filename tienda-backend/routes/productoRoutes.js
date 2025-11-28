const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');

const {
  obtenerProductos,
  obtenerProducto,
  crearProducto,
  actualizarProducto,
  eliminarProducto
} = require('../controllers/productoController');

// CRUD Productos
router.get('/', obtenerProductos);
router.get('/:id', obtenerProducto);
router.post('/', upload.single('imagen'), crearProducto);
router.put('/:id', upload.single('imagen'), actualizarProducto);
router.delete('/:id', eliminarProducto);

module.exports = router;
