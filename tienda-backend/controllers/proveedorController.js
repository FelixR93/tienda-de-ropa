const Proveedor = require('../models/Proveedor');

// Obtener todos los proveedores
const getProveedores = async (req, res) => {
  try {
    const proveedores = await Proveedor.find();
    res.json(proveedores);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener proveedores' });
  }
};

// Crear proveedor
const crearProveedor = async (req, res) => {
  const { nombre, contacto } = req.body;
  if (!nombre) return res.status(400).json({ message: 'Nombre es obligatorio' });

  try {
    const proveedor = new Proveedor({ nombre, contacto });
    await proveedor.save();
    res.status(201).json(proveedor);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear proveedor' });
  }
};

module.exports = { getProveedores, crearProveedor };
