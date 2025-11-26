const express = require('express');
const router = express.Router();
const { getCategorias, crearCategoria } = require('../controllers/categoriaController');

router.get('/', getCategorias);
router.post('/', crearCategoria);

module.exports = router;
