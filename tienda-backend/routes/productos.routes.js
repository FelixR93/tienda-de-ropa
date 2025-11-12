const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/productos.controller');
const { validarProducto } = require('../middlewares/validar');

router.get('/', ctrl.listar);
router.get('/:id', ctrl.obtener);
router.post('/', validarProducto, ctrl.crear);
router.put('/:id', validarProducto, ctrl.actualizar);
router.delete('/:id', ctrl.eliminar);

module.exports = router;
