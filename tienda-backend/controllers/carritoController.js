const Carrito = require('../models/Carrito');
const Producto = require('../models/Producto');

// Crear un carrito vacío
const crearCarrito = async (req, res) => {
  try {
    const carrito = new Carrito({ productos: [] });
    await carrito.save();
    res.status(201).json(carrito);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear carrito' });
  }
};

// Obtener carrito por ID
const getCarrito = async (req, res) => {
  try {
    const { id } = req.params;
    const carrito = await Carrito.findById(id).populate('productos.producto');
    if (!carrito) return res.status(404).json({ message: 'Carrito no encontrado' });
    res.json(carrito);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener carrito' });
  }
};

// Agregar producto al carrito
const agregarAlCarrito = async (req, res) => {
  try {
    const { id } = req.params; // ID del carrito
    const { productoId, cantidad } = req.body;

    if (!productoId || !cantidad || cantidad <= 0)
      return res.status(400).json({ message: 'Producto y cantidad son requeridos' });

    const producto = await Producto.findById(productoId);
    if (!producto) return res.status(404).json({ message: 'Producto no encontrado' });

    const carrito = await Carrito.findById(id);
    if (!carrito) return res.status(404).json({ message: 'Carrito no encontrado' });

    const productoExistente = carrito.productos.find(p => p.producto.equals(productoId));
    if (productoExistente) {
      productoExistente.cantidad += cantidad;
    } else {
      carrito.productos.push({ producto: productoId, cantidad });
    }

    await carrito.save();
    res.json(carrito);
  } catch (error) {
    res.status(500).json({ message: 'Error al agregar al carrito' });
  }
};

// Eliminar producto del carrito
const eliminarDelCarrito = async (req, res) => {
  try {
    const { id } = req.params; // ID del carrito
    const { productoId } = req.body;

    const carrito = await Carrito.findById(id);
    if (!carrito) return res.status(404).json({ message: 'Carrito no encontrado' });

    carrito.productos = carrito.productos.filter(p => !p.producto.equals(productoId));
    await carrito.save();
    res.json(carrito);
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar producto del carrito' });
  }
};

// Vaciar carrito
const vaciarCarrito = async (req, res) => {
  try {
    const { id } = req.params;
    const carrito = await Carrito.findById(id);
    if (!carrito) return res.status(404).json({ message: 'Carrito no encontrado' });

    carrito.productos = [];
    await carrito.save();
    res.json({ message: 'Carrito vaciado correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al vaciar carrito' });
  }
};

module.exports = {
  crearCarrito,
  getCarrito,
  agregarAlCarrito,
  eliminarDelCarrito,
  vaciarCarrito
};
