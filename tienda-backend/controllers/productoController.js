const Producto = require('../models/Producto');
const { validarCampos, esNumeroPositivo } = require('../utils/validarDatos');

// Obtener todos
const obtenerProductos = async (req, res) => {
  try {
    const productos = await Producto.find();
    res.json(productos);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener productos' });
  }
};

// Obtener uno
const obtenerProducto = async (req, res) => {
  try {
    const producto = await Producto.findById(req.params.id);
    if (!producto) return res.status(404).json({ message: 'Producto no encontrado' });

    res.json({ producto });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener producto' });
  }
};

// Crear producto
const crearProducto = async (req, res) => {
  const { nombre, descripcion, precio, stock } = req.body;

  if (!validarCampos(req.body, ['nombre', 'descripcion', 'precio', 'stock']))
    return res.status(400).json({ message: 'Todos los campos son obligatorios' });

  if (!esNumeroPositivo(precio) || !esNumeroPositivo(stock))
    return res.status(400).json({ message: 'Precio y stock deben ser positivos' });

  const imagen = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    const producto = new Producto({
      nombre,
      descripcion,
      precio,
      stock,
      imagen
    });

    await producto.save();
    res.status(201).json(producto);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear producto' });
  }
};

// Actualizar producto
const actualizarProducto = async (req, res) => {
  const { id } = req.params;

  if (req.body.precio && !esNumeroPositivo(req.body.precio))
    return res.status(400).json({ message: 'Precio debe ser positivo' });

  if (req.body.stock && !esNumeroPositivo(req.body.stock))
    return res.status(400).json({ message: 'Stock debe ser positivo' });

  const data = {
    nombre: req.body.nombre,
    descripcion: req.body.descripcion,
    precio: req.body.precio,
    stock: req.body.stock
  };

  if (req.file) {
    data.imagen = `/uploads/${req.file.filename}`;
  }

  try {
    const producto = await Producto.findByIdAndUpdate(id, data, { new: true });
    if (!producto) return res.status(404).json({ message: 'Producto no encontrado' });

    res.json(producto);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar producto' });
  }
};

// Eliminar
const eliminarProducto = async (req, res) => {
  try {
    const producto = await Producto.findByIdAndDelete(req.params.id);
    if (!producto) return res.status(404).json({ message: 'Producto no encontrado' });

    res.json({ message: 'Producto eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar producto' });
  }
};

module.exports = {
  obtenerProductos,
  obtenerProducto,
  crearProducto,
  actualizarProducto,
  eliminarProducto
};
