const Joi = require('joi');

const validarProducto = (req, res, next) => {
  const schema = Joi.object({
    nombre: Joi.string().min(1).required(),
    descripcion: Joi.string().allow('').optional(),
    precio: Joi.number().min(0).required(),
    stock: Joi.number().integer().min(0).required(),
    categoria: Joi.string().optional()
  });

  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  next();
};

module.exports = { validarProducto };
