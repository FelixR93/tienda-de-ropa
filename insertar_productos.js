// archivo: insertar_productos.js
// Ejecutar con:
// mongosh "mongodb://127.0.0.1:27017/tiendaDB" insertar_productos.js

db.productos.insertMany([{nombre:"Camiseta Roja",descripcion:"Camiseta de algodón 100% roja",precio:15.99,stock:20,imagen:"roja.png"},{nombre:"Pantalón Jeans",descripcion:"Pantalón de mezclilla azul",precio:29.99,stock:15,imagen:"Jeans.png"},{nombre:"Zapatillas Deportivas",descripcion:"Zapatillas cómodas para correr",precio:49.99,stock:10,imagen:"zapatos.png"}]);
