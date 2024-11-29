const bcrypt = require('bcrypt');

const SALT_ROUNDS = 10;

/**
 * Gera o hash para a senha.
 * @param {string} password - Senha em texto claro.
 * @returns {Promise<string>} Hash da senha.
 */
async function hashPassword(password) {
  return await bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Compara uma senha em texto claro com um hash armazenado.
 * @param {string} password - Senha em texto claro.
 * @param {string} hash - Hash armazenado.
 * @returns {Promise<boolean>} Resultado da comparação.
 */
async function verifyPassword(password, hash) {
  return await bcrypt.compare(password, hash);
}

module.exports = { hashPassword, verifyPassword };
