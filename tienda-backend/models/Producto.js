const mongoose = require('mongoose');

const ProductoSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  descripcion: String,
  precio: { type: Number, required: true },
  stock: { type: Number, required: true },
  imagen: String,
  categoria: { type: mongoose.Schema.Types.ObjectId, ref: 'Categoria' },
  proveedor: { type: mongoose.Schema.Types.ObjectId, ref: 'Proveedor' }
});

module.exports = mongoose.model('Producto', ProductoSchema);
