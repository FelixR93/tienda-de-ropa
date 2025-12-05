// ------------------------------------------------------
// Modelo de carrito XI-XI
// - Un carrito por usuario
// - items: [{ product, quantity, price }]
// - totalAmount: suma de (quantity * price)
// ------------------------------------------------------
const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    price: {
      // precio unitario al momento de agregar
      type: Number,
      required: true,
      min: 0,
    },
  },
  { _id: false }
);

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      unique: true,
      required: true,
    },
    items: {
      type: [cartItemSchema],
      default: [],
    },
    totalAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Método para recalcular totalAmount
cartSchema.methods.recalculateTotal = function () {
  this.totalAmount = this.items.reduce(
    (acc, item) => acc + item.quantity * item.price,
    0
  );
};

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
