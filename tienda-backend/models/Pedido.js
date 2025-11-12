const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
  producto: { type: mongoose.Schema.Types.ObjectId, ref: 'Producto', required: true },
  cantidad: { type: Number, required: true, min: 1 }
});

const PedidoSchema = new mongoose.Schema({
  items: [ItemSchema],
  total: { type: Number, required: true },
  estado: { type: String, enum: ['pendiente', 'pagado', 'enviado'], default: 'pendiente' },
  creadoEn: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Pedido', PedidoSchema);
