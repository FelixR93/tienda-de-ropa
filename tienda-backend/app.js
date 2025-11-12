const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const productosRoutes = require('./routes/productos.routes');
const carritoRoutes = require('./routes/carrito.routes');
const { errorHandler } = require('./middlewares/error.handler');

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Rutas
app.use('/api/productos', productosRoutes);
app.use('/api/carrito', carritoRoutes);

// Middleware de manejo de errores
app.use(errorHandler);

module.exports = app;
