/**
 * Valida que todos los campos requeridos existan y no estén vacíos.
 * Acepta 0 y strings numéricos.
 */
const validarCampos = (obj, campos) => {
  for (let campo of campos) {

    // Si el campo no existe o está vacío
    if (
      obj[campo] === undefined ||
      obj[campo] === null ||
      obj[campo] === ''
    ) {
      return false;
    }
  }
  return true;
};

/**
 * Valida que un número sea positivo, convirtiendo strings numéricos a number.
 */
const esNumeroPositivo = (numero) => {
  const num = Number(numero); // convierte "20" a 20

  return !isNaN(num) && num >= 0;
};

module.exports = {
  validarCampos,
  esNumeroPositivo
};
