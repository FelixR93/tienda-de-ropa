const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/carrito.controller');

router.post('/', ctrl.crearPedido);
router.get('/', ctrl.listarCompras);
router.get('/:id', ctrl.obtenerPedido);

module.exports = router;
