const express = require('express');
const { registrar, login, perfil } = require('../controllers/authController');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', registrar);
router.post('/login', login);
router.get('/perfil', authMiddleware, perfil);

module.exports = router;
