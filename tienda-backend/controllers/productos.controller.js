const Producto = require('../models/Producto');
const asyncWrapper = require('../utils/asyncWrapper');

exports.listar = asyncWrapper(async (req, res) => {
  const productos = await Producto.find();
  res.json(productos);
});

exports.obtener = asyncWrapper(async (req, res) => {
  const producto = await Producto.findById(req.params.id);
  if (!producto) return res.status(404).json({ error: 'Producto no encontrado' });
  res.json(producto);
});

exports.crear = asyncWrapper(async (req, res) => {
  const nuevo = new Producto(req.body);
  await nuevo.save();
  res.status(201).json(nuevo);
});

exports.actualizar = asyncWrapper(async (req, res) => {
  const actualizado = await Producto.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!actualizado) return res.status(404).json({ error: 'Producto no encontrado' });
  res.json(actualizado);
});

exports.eliminar = asyncWrapper(async (req, res) => {
  const eliminado = await Producto.findByIdAndDelete(req.params.id);
  if (!eliminado) return res.status(404).json({ error: 'Producto no encontrado' });
  res.json({ message: 'Producto eliminado correctamente' });
});
