const express = require('express');
const router = express.Router();
const carritoController = require('../controllers/carritoController');

router.post('/', carritoController.crearCarrito); // Crear carrito
router.get('/:id', carritoController.getCarrito); // Obtener carrito
router.post('/:id/productos', carritoController.agregarAlCarrito); // Agregar producto
router.delete('/:id/productos', carritoController.eliminarDelCarrito); // Eliminar producto
router.delete('/:id', carritoController.vaciarCarrito); // Vaciar carrito

module.exports = router;
