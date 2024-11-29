const prisma = require('../config/db');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const AppError = require('../utils/AppError');
const { hashPassword, verifyPassword } = require('../utils/passwordUtils');

const authService = {
  /**
   * Busca um usuário pelo email.
   * @param {string} email - Email do usuário.
   * @returns {object} Usuário encontrado ou null.
   */
  async findUserByEmail(email) {
    try {
      return await prisma.user.findUnique({
        where: { email },
      });
    } catch (error) {
      console.error('Erro ao buscar usuário:', error.message);
      throw new AppError('Erro ao buscar usuário.', 500);
    }
  },

  /**
   * Autentica um usuário e retorna um token JWT.
   * @param {string} email - Email do usuário.
   * @param {string} password - Senha do usuário.
   * @returns {object} Token JWT e informações do usuário.
   */
  async authenticateUser(email, password) {
    if (!email || !password) {
      throw new AppError('Email e senha são obrigatórios.', 400);
    }

    // Busca o usuário no banco de dados
    const user = await this.findUserByEmail(email);
    if (!user) {
      throw new AppError('Credenciais inválidas.', 401);
    }

    // Verifica a senha
    const isPasswordValid = await verifyPassword(password, user.password);
    if (!isPasswordValid) {
      throw new AppError('Credenciais inválidas.', 401);
    }

    // Verifica se a chave secreta do JWT está configurada
    if (!config.jwt.secret) {
      console.error('JWT_SECRET não está configurado.');
      throw new AppError('Erro na configuração do sistema. Entre em contato com o suporte.', 500);
    }

    // Gera o token JWT
    const token = jwt.sign(
      { id: user.id, role: user.role },
      config.jwt.secret,
      { expiresIn: config.jwt.expiration }
    );

    return {
      token,
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
    };
  },

  /**
   * Cria um novo usuário.
   * @param {object} userData - Dados do novo usuário.
   * @returns {object} Dados do usuário criado.
   */
  async createUser(userData) {
    if (!userData.email || !userData.password || !userData.name) {
      throw new AppError('Nome, email e senha são obrigatórios.', 400);
    }

    // Verifica se o email já está em uso
    const existingUser = await this.findUserByEmail(userData.email);
    if (existingUser) {
      throw new AppError('Email já está em uso.', 409);
    }

    // Gera o hash da senha
    const hashedPassword = await hashPassword(userData.password);

    try {
      // Cria o novo usuário
      const user = await prisma.user.create({
        data: { ...userData, password: hashedPassword },
      });

      return {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      };
    } catch (error) {
      console.error('Erro ao criar usuário:', error.message);
      throw new AppError('Erro ao criar usuário.', 500);
    }
  },
};

module.exports = authService;
