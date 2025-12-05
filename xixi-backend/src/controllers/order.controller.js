// ------------------------------------------------------
// Controlador de órdenes XI-XI
// - Crea orden a partir del carrito actual
// - Lista órdenes del usuario
// - Lista todas las órdenes (admin)
// - Obtiene orden por id
// - Actualiza estado de la orden
// ------------------------------------------------------

const Order = require('../models/Order');
const Cart = require('../models/Cart');
const { ApiError } = require('../middlewares/error.middleware');

// ------------------------------------------------------
// Crear orden a partir del carrito del usuario
// POST /api/orders/checkout
// ------------------------------------------------------
const createOrderFromCart = async (req, res, next) => {
  try {
    // Aseguramos que venga un usuario (authMiddleware debe haber puesto req.user)
    const userId = req.user && req.user.id;
    if (!userId) {
      throw new ApiError(401, 'No autorizado');
    }

    // Buscamos el carrito de ese usuario
    const cart = await Cart.findOne({ user: userId }).populate('items.product');
    if (!cart || !cart.items || cart.items.length === 0) {
      throw new ApiError(400, 'No hay productos en el carrito para crear la orden');
    }

    // Leemos datos de envío desde el body (no hacemos validaciones estrictas aquí)
    const { shippingAddress, notes, paymentMethod } = req.body || {};

    // Mapeamos items del carrito -> items de la orden
    const orderItems = cart.items.map((item) => {
      if (!item.product || !item.product._id) {
        throw new ApiError(400, 'Producto inválido en el carrito');
      }

      const quantity = item.quantity || 1;
      const price = item.price || 0;
      const subtotal = quantity * price;

      return {
        product: item.product._id,
        // MUY IMPORTANTE: el modelo Order exige name, quantity, price, subtotal
        name: item.product.name || 'Producto sin nombre',
        quantity,
        price,
        subtotal,
      };
    });

    // Calculamos total
    const totalAmount = orderItems.reduce((sum, it) => sum + (it.subtotal || 0), 0);

    // Construimos dirección de envío “suave” (no rompemos si vienen strings sueltos)
    let shippingObj = {};
    if (shippingAddress && typeof shippingAddress === 'object') {
      shippingObj = {
        street: shippingAddress.street || '',
        city: shippingAddress.city || '',
        postalCode: shippingAddress.postalCode || '',
        country: shippingAddress.country || '',
      };
    }

    // Creamos la orden
    const order = await Order.create({
      user: userId,
      items: orderItems,
      totalAmount,
      shippingAddress: shippingObj,
      notes: notes || '',
      paymentMethod: paymentMethod || 'CASH',
      status: 'PENDING',
    });

    // Opcional: vaciar carrito después del checkout
    cart.items = [];
    cart.totalAmount = 0;
    await cart.save();

    return res.status(201).json({
      success: true,
      message: 'Orden creada correctamente',
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

// ------------------------------------------------------
// Órdenes del usuario logueado
// GET /api/orders/my
// ------------------------------------------------------
const getMyOrders = async (req, res, next) => {
  try {
    const userId = req.user && req.user.id;
    if (!userId) {
      throw new ApiError(401, 'No autorizado');
    }

    const orders = await Order.find({ user: userId })
      .populate('items.product')
      .sort({ createdAt: -1 });

    return res.json({
      success: true,
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};

// ------------------------------------------------------
// Todas las órdenes (solo admin)
// GET /api/orders
// ------------------------------------------------------
const getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .populate('items.product')
      .sort({ createdAt: -1 });

    return res.json({
      success: true,
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};

// ------------------------------------------------------
// Obtener orden por ID
// GET /api/orders/:id
// ------------------------------------------------------
const getOrderById = async (req, res, next) => {
  try {
    const orderId = req.params.id;

    const order = await Order.findById(orderId)
      .populate('user', 'name email')
      .populate('items.product');

    if (!order) {
      throw new ApiError(404, 'Orden no encontrada');
    }

    return res.json({
      success: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

// ------------------------------------------------------
// Actualizar estado de la orden (admin)
// PATCH /api/orders/:id/status
// body: { status: 'PENDING' | 'PAID' | 'SHIPPED' | 'COMPLETED' | 'CANCELLED' }
// ------------------------------------------------------
const updateOrderStatus = async (req, res, next) => {
  try {
    const orderId = req.params.id;
    const { status } = req.body;

    const validStatuses = ['PENDING', 'PAID', 'SHIPPED', 'COMPLETED', 'CANCELLED'];
    if (!validStatuses.includes(status)) {
      throw new ApiError(400, 'Estado de orden inválido');
    }

    const order = await Order.findById(orderId);
    if (!order) {
      throw new ApiError(404, 'Orden no encontrada');
    }

    order.status = status;
    await order.save();

    return res.json({
      success: true,
      message: 'Estado de la orden actualizado',
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrderFromCart,
  getMyOrders,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
};
