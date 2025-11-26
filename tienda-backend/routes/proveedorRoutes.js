const express = require('express');
const router = express.Router();
const { getProveedores, crearProveedor } = require('../controllers/proveedorController');

router.get('/', getProveedores);
router.post('/', crearProveedor);

module.exports = router;
