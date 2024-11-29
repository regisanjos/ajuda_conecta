const authService = require('../services/authService');
const AppError = require('../utils/AppError');

const authController = {
  /**
   * Controlador para login de usuário.
   * @param {object} req - Objeto da requisição.
   * @param {object} res - Objeto da resposta.
   * @param {function} next - Próximo middleware.
   */
  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const { token, user } = await authService.authenticateUser(email, password);

      return res.status(200).json({ success: true, token, user });
    } catch (error) {
      console.error('Erro ao realizar login:', error.message);
      next(new AppError(error.message, error.statusCode || 500));
    }
  },

  /**
   * Controlador para registro de novo usuário.
   * @param {object} req - Objeto da requisição.
   * @param {object} res - Objeto da resposta.
   * @param {function} next - Próximo middleware.
   */
  async register(req, res, next) {
    try {
      const userData = req.body;
      const user = await authService.createUser(userData);

      return res.status(201).json({ success: true, data: user });
    } catch (error) {
      console.error('Erro ao registrar usuário:', error.message);
      next(new AppError(error.message, error.statusCode || 500));
    }
  },
};

module.exports = authController;
