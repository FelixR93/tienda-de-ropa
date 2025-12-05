// ------------------------------------------------------
// Rutas de órdenes XI-XI
// ------------------------------------------------------
const express = require('express');
const { authMiddleware } = require('../middlewares/auth.middleware');
const { adminMiddleware } = require('../middlewares/admin.middleware');
const {
  createOrderFromCart,
  getMyOrders,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
} = require('../controllers/order.controller');

const router = express.Router();

// Crear orden desde el carrito
router.post('/checkout', authMiddleware, createOrderFromCart);

// Órdenes del usuario actual
router.get('/my', authMiddleware, getMyOrders);

// Todas las órdenes (solo admin)
router.get('/', authMiddleware, adminMiddleware, getAllOrders);

// Detalle de una orden
router.get('/:id', authMiddleware, getOrderById);

// Actualizar estado (solo admin)
router.patch('/:id/status', authMiddleware, adminMiddleware, updateOrderStatus);

module.exports = router;
