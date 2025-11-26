const mongoose = require('mongoose');

const ProveedorSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  contacto: String
});

module.exports = mongoose.model('Proveedor', ProveedorSchema);
