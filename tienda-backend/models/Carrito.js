const mongoose = require('mongoose');

const CarritoSchema = new mongoose.Schema({
  productos: [
    {
      producto: { type: mongoose.Schema.Types.ObjectId, ref: 'Producto', required: true },
      cantidad: { type: Number, required: true, min: 1 }
    }
  ],
  creadoEn: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Carrito', CarritoSchema);
