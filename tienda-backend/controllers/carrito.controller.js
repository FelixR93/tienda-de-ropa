const Pedido = require('../models/Pedido');
const Producto = require('../models/Producto');
const asyncWrapper = require('../utils/asyncWrapper');

exports.crearPedido = asyncWrapper(async (req, res) => {
  const { items } = req.body; // [{ producto: id, cantidad: n }]
  if (!Array.isArray(items) || items.length === 0)
    return res.status(400).json({ error: 'El carrito está vacío' });

  let total = 0;

  // Validar productos y stock
  for (const item of items) {
    if (!item.producto || !item.cantidad || item.cantidad <= 0)
      return res.status(400).json({ error: 'Datos inválidos en un item' });

    const producto = await Producto.findById(item.producto);
    if (!producto) return res.status(404).json({ error: 'Producto no encontrado' });
    if (producto.stock < item.cantidad)
      return res.status(400).json({ error: `Stock insuficiente para ${producto.nombre}` });

    total += producto.precio * item.cantidad;
  }

  // Descontar stock
  for (const item of items) {
    await Producto.findByIdAndUpdate(item.producto, { $inc: { stock: -item.cantidad } });
  }

  // Crear pedido
  const pedido = new Pedido({ items, total });
  await pedido.save();

  res.status(201).json(pedido);
});

exports.listarCompras = asyncWrapper(async (req, res) => {
  const pedidos = await Pedido.find().populate('items.producto');
  res.json(pedidos);
});

exports.obtenerPedido = asyncWrapper(async (req, res) => {
  const pedido = await Pedido.findById(req.params.id).populate('items.producto');
  if (!pedido) return res.status(404).json({ error: 'Pedido no encontrado' });
  res.json(pedido);
});
