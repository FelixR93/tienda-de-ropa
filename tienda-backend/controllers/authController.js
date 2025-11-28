const Usuario = require('../models/Usuario'); 
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Generar token JWT
const generarToken = (usuario) => {
  return jwt.sign(
    { id: usuario._id, role: usuario.role, email: usuario.email },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// Registrar usuario
exports.registrar = async (req, res) => {
  try {
    const { nombre, apellido, email, password, role, ...otros } = req.body;

    if (!nombre || !apellido || !email || !password) {
      return res.status(400).json({ ok: false, msg: 'Faltan datos obligatorios.' });
    }

    const existe = await Usuario.findOne({ email });
    if (existe) return res.status(400).json({ ok: false, msg: 'Email ya registrado.' });

    // Hashear la contraseña
    const passwordHash = await bcrypt.hash(password, 10);

    // Validar role
    const roleValido = ['cliente', 'admin', 'tecnico'].includes(role) ? role : 'cliente';

    const nuevoUsuario = new Usuario({ nombre, apellido, email, password: passwordHash, role: roleValido, ...otros });
    await nuevoUsuario.save();

    const token = generarToken(nuevoUsuario);

    res.status(201).json({
      ok: true,
      msg: 'Usuario registrado correctamente.',
      token,
      usuario: {
        id: nuevoUsuario._id,
        nombre: nuevoUsuario.nombre,
        apellido: nuevoUsuario.apellido,
        email: nuevoUsuario.email,
        role: nuevoUsuario.role
      }
    });
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ ok: false, msg: 'Error en el servidor.' });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ ok: false, msg: 'Email y contraseña son obligatorios.' });

    const usuario = await Usuario.findOne({ email });
    if (!usuario) return res.status(404).json({ ok: false, msg: 'Usuario no encontrado.' });

    const correcto = await bcrypt.compare(password, usuario.password);
    if (!correcto) return res.status(401).json({ ok: false, msg: 'Contraseña incorrecta.' });

    const token = generarToken(usuario);

    res.json({
      ok: true,
      msg: 'Login exitoso.',
      token,
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        email: usuario.email,
        role: usuario.role
      }
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ ok: false, msg: 'Error en el servidor.' });
  }
};

// Perfil del usuario
exports.perfil = async (req, res) => {
  try {
    if (!req.usuario) return res.status(401).json({ ok: false, msg: 'No autorizado.' });

    const usuario = await Usuario.findById(req.usuario.id).select('-password');
    if (!usuario) return res.status(404).json({ ok: false, msg: 'Usuario no encontrado.' });

    res.json({ ok: true, usuario });
  } catch (error) {
    console.error('Error al obtener perfil:', error);
    res.status(500).json({ ok: false, msg: 'Error en el servidor.' });
  }
};
