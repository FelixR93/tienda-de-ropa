const Categoria = require('../models/Categoria');

// Obtener todas las categorías
const getCategorias = async (req, res) => {
  try {
    const categorias = await Categoria.find();
    res.json(categorias);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener categorías', error });
  }
};

// Crear categoría
const crearCategoria = async (req, res) => {
  console.log("REQ BODY LLEGA:", req.body);

  const { nombre } = req.body;
  if (!nombre) return res.status(400).json({ message: 'Nombre es obligatorio' });

  try {
    const categoria = new Categoria({ nombre });
    await categoria.save();
    res.status(201).json(categoria);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear categoría', error });
  }
};

module.exports = { getCategorias, crearCategoria };
