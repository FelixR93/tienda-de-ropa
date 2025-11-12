const mongoose = require('mongoose');

const ProductoSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  descripcion: { type: String, default: '' },
  precio: { type: Number, required: true, min: 0 },
  stock: { type: Number, required: true, min: 0 },
  categoria: { type: String, default: 'ropa' },
  creadoEn: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Producto', ProductoSchema);
