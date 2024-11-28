const bcrypt = require('bcryptjs');
const prisma = require('../config/db');

const authService = {
  // Método para verificar se o e-mail já está em uso
  async findUserByEmail(email) {
    const user = await prisma.user.findUnique({
      where: { email },
    });
    return user;
  },

  // Método para criar um novo usuário
  async createUser(userData) {
    try {
      // Verificar se o e-mail já está em uso
      const existingUser = await this.findUserByEmail(userData.email);
      if (existingUser) {
        throw new Error('Email já está em uso.');
      }

      // Criptografar a senha antes de salvar no banco
      const hashedPassword = await bcrypt.hash(userData.password, 10);

      // Criando o usuário no banco de dados
      const user = await prisma.user.create({
        data: {
          email: userData.email,
          password: hashedPassword,  // Usar a senha criptografada
          name: userData.name,
          role: userData.role,
        },
      });

      console.log('Usuário criado com sucesso:', user);
      return user;
    } catch (error) {
      console.error("Erro ao criar usuário:", error);
      throw new Error('Erro ao criar usuário. Verifique os dados e tente novamente.');
    }
  },

  // Método para autenticar um usuário
  async authenticateUser(email, password) {
    try {
      // Buscar o usuário pelo e-mail
      const user = await prisma.user.findUnique({
        where: { email },
      });

      // Verificar se o usuário existe
      if (!user) {
        throw new Error('Credenciais inválidas.');
      }

      // Comparar a senha fornecida com a armazenada no banco
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        throw new Error('Credenciais inválidas.');
      }

      console.log('Autenticação bem-sucedida para:', user);
      return user;
    } catch (error) {
      console.error("Erro ao autenticar usuário:", error);
      throw new Error('Erro ao autenticar. Verifique as credenciais e tente novamente.');
    }
  },
};

module.exports = authService;
