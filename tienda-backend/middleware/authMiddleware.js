const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');

exports.authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ ok: false, msg: 'No autorizado. Token no encontrado.' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const usuario = await Usuario.findById(decoded.id).select('-password');

    if (!usuario) return res.status(404).json({ ok: false, msg: 'Usuario no encontrado.' });

    req.usuario = usuario;
    next();
  } catch (error) {
    console.error('Error en authMiddleware:', error);
    res.status(401).json({ ok: false, msg: 'Token inválido o expirado.' });
  }
};

exports.roleMiddleware = (rolesPermitidos = []) => {
  return (req, res, next) => {
    try {
      const roleUsuario = req.usuario.role;

      if (!rolesPermitidos.includes(roleUsuario)) {
        return res.status(403).json({
          ok: false,
          msg: 'Acceso denegado. No tienes permisos para realizar esta acción.'
        });
      }

      next();
    } catch (error) {
      console.error('Error en roleMiddleware:', error);
      return res.status(500).json({ ok: false, msg: 'Error en el servidor.' });
    }
  };
};
