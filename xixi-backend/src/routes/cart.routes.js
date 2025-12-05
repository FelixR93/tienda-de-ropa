// ------------------------------------------------------
// Rutas para manejar el carrito del usuario.
// Base: /api/cart
// Todas requieren authMiddleware.
// ------------------------------------------------------
const express = require('express');
const { body } = require('express-validator');

const {
  getCart,
  addItem,
  updateItem,
  removeItem,
  clearCart,
} = require('../controllers/cart.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');

const router = express.Router();

// Obtener carrito del usuario actual
// GET /api/cart
router.get('/', authMiddleware, getCart);

// Agregar producto al carrito
// POST /api/cart/items
router.post(
  '/items',
  authMiddleware,
  [
    body('productId')
      .notEmpty()
      .withMessage('El productId es obligatorio'),
    body('quantity')
      .optional()
      .isInt({ min: 1 })
      .withMessage('La cantidad debe ser al menos 1'),
  ],
  // Ojo: NO usamos handleValidationErrors aquí para evitar errores.
  addItem
);

// Actualizar cantidad de un producto
// PUT /api/cart/items/:productId
router.put(
  '/items/:productId',
  authMiddleware,
  [
    body('quantity')
      .isInt()
      .withMessage('La cantidad debe ser un número entero'),
  ],
  // Sin handleValidationErrors
  updateItem
);

// Eliminar un producto del carrito
// DELETE /api/cart/items/:productId
router.delete('/items/:productId', authMiddleware, removeItem);

// Vaciar carrito
// DELETE /api/cart
router.delete('/', authMiddleware, clearCart);

module.exports = router;
