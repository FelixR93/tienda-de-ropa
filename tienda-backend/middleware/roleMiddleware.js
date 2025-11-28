const express = require('express');
const { authMiddleware, roleMiddleware } = require('../middleware/authMiddleware');
const { registrar, login, perfil } = require('../controllers/authController');

const router = express.Router();

// Rutas públicas
router.post('/register', registrar);
router.post('/login', login);

// Ruta protegida (solo usuario autenticado)
router.get('/perfil', authMiddleware, perfil);

// Ejemplo de ruta solo para admin
router.get('/admin', authMiddleware, roleMiddleware(['admin']), (req, res) => {
  res.json({ ok: true, msg: 'Acceso admin permitido' });
});

module.exports = router;
