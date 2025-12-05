// ------------------------------------------------------
// Controlador de carrito XI-XI
// Rutas esperadas por el frontend:
//
// GET    /api/cart            -> getCart
// POST   /api/cart/add        -> addItem
// PUT    /api/cart/update     -> updateItem
// DELETE /api/cart/item/:id   -> removeItem
// DELETE /api/cart/clear      -> clearCart
// ------------------------------------------------------
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { ApiError } = require('../middlewares/error.middleware');

// Asegura que el usuario tenga un carrito
const ensureUserCart = async (userId) => {
  let cart = await Cart.findOne({ user: userId }).populate('items.product');
  if (!cart) {
    cart = await Cart.create({ user: userId, items: [], totalAmount: 0 });
    cart = await cart.populate('items.product');
  }
  return cart;
};

// GET /api/cart
const getCart = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const cart = await ensureUserCart(userId);

    return res.json({
      success: true,
      data: cart,
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/cart/add
// body: { productId, quantity }
const addItem = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      throw new ApiError(400, 'productId es requerido');
    }

    const qty = Number(quantity) || 1;
    if (qty <= 0) {
      throw new ApiError(400, 'La cantidad debe ser mayor que 0');
    }

    const product = await Product.findById(productId);
    if (!product) {
      throw new ApiError(404, 'Producto no encontrado');
    }

    // Opcional: validar stock
    if (product.stock < qty) {
      throw new ApiError(400, 'No hay stock suficiente para este producto');
    }

    let cart = await ensureUserCart(userId);

    const existingIndex = cart.items.findIndex(
      (item) => String(item.product._id || item.product) === String(productId)
    );

    if (existingIndex >= 0) {
      cart.items[existingIndex].quantity += qty;
    } else {
      cart.items.push({
        product: product._id,
        quantity: qty,
        price: product.price,
      });
    }

    // Recalcular total
    cart.recalculateTotal();
    await cart.save();
    cart = await cart.populate('items.product');

    return res.json({
      success: true,
      data: cart,
      message: 'Producto agregado al carrito',
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/cart/update
// body: { productId, quantity }
const updateItem = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { productId, quantity } = req.body;

    if (!productId) {
      throw new ApiError(400, 'productId es requerido');
    }

    const qty = Number(quantity);
    if (isNaN(qty)) {
      throw new ApiError(400, 'quantity inválido');
    }

    let cart = await ensureUserCart(userId);

    const idx = cart.items.findIndex(
      (item) => String(item.product._id || item.product) === String(productId)
    );

    if (idx === -1) {
      throw new ApiError(404, 'El producto no está en el carrito');
    }

    if (qty <= 0) {
      // eliminar item si cantidad <= 0
      cart.items.splice(idx, 1);
    } else {
      cart.items[idx].quantity = qty;
    }

    cart.recalculateTotal();
    await cart.save();
    cart = await cart.populate('items.product');

    return res.json({
      success: true,
      data: cart,
      message: 'Carrito actualizado',
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/cart/item/:productId
const removeItem = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;

    if (!productId) {
      throw new ApiError(400, 'productId es requerido');
    }

    let cart = await ensureUserCart(userId);

    const before = cart.items.length;
    cart.items = cart.items.filter(
      (item) => String(item.product._id || item.product) !== String(productId)
    );

    if (cart.items.length === before) {
      throw new ApiError(404, 'El producto no estaba en el carrito');
    }

    cart.recalculateTotal();
    await cart.save();
    cart = await cart.populate('items.product');

    return res.json({
      success: true,
      data: cart,
      message: 'Producto eliminado del carrito',
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/cart/clear
const clearCart = async (req, res, next) => {
  try {
    const userId = req.user.id;
    let cart = await ensureUserCart(userId);

    cart.items = [];
    cart.totalAmount = 0;
    await cart.save();
    cart = await cart.populate('items.product');

    return res.json({
      success: true,
      data: cart,
      message: 'Carrito vacío',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCart,
  addItem,
  updateItem,
  removeItem,
  clearCart,
};
