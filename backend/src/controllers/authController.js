const authService = require('../services/authService');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Função para validar os campos obrigatórios
const validateRequestBody = (fields, body) => {
  for (const field of fields) {
    if (!body[field] || body[field].trim() === '') {
      return `${field.charAt(0).toUpperCase() + field.slice(1)} é obrigatório.`;
    }
  }
  return null;
};

// Função de tratamento de erro
const handleError = (res, error, customMessage) => {
  const statusCode = error.statusCode || 500;
  const message = customMessage || error.message || 'Erro interno no servidor.';
  console.error('Erro:', message, error);
  res.status(statusCode).json({ error: message });
};

const authController = {
  // Método para registrar um usuário
  async register(req, res) {
    const { name, email, password, role } = req.body;

    // Validação dos campos obrigatórios
    const validationError = validateRequestBody(['name', 'email', 'password', 'role'], req.body);
    if (validationError) {
      console.log("Erro de validação:", validationError);
      return res.status(400).json({ error: validationError });
    }

    try {
      console.log('Iniciando o processo de criação de usuário...');
      
      // Criptografando a senha
      const hashedPassword = await bcrypt.hash(password, 10);
      console.log('Senha criptografada:', hashedPassword);

      // Criando o usuário
      const user = await authService.createUser({
        name,
        email,
        password: hashedPassword,
        role,
      });

      const { password: _, ...userWithoutPassword } = user; // Remover senha do retorno

      res.status(201).json({
        success: true,
        message: 'Usuário registrado com sucesso.',
        data: userWithoutPassword,
      });
    } catch (error) {
      console.error("Erro durante o processo de registro:", error);
      if (error.message === 'Email já está em uso.') {
        return res.status(400).json({ error: 'Email já está em uso.' });
      }
      handleError(res, error, 'Erro ao registrar o usuário.');
    }
  },

  // Método para login do usuário
  async login(req, res) {
    const { email, password } = req.body;

    // Validação dos campos obrigatórios
    const validationError = validateRequestBody(['email', 'password'], req.body);
    if (validationError) {
      console.log("Erro de validação:", validationError);
      return res.status(400).json({ error: validationError });
    }

    try {
      console.log('Iniciando o processo de autenticação...');
      
      // Verificando as credenciais do usuário
      const user = await authService.authenticateUser(email, password);
      console.log('Usuário autenticado:', user);

      // Gerar Token JWT
      if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET não configurado nas variáveis de ambiente.');
      }
      const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '1h' } // Definir o tempo de expiração do token
      );

      // Retornar o token JWT
      res.status(200).json({
        success: true,
        message: 'Login realizado com sucesso.',
        token,
      });
    } catch (error) {
      console.error("Erro ao realizar login:", error);
      if (error.message === 'Credenciais inválidas.') {
        return res.status(401).json({ error: error.message });
      }
      handleError(res, error, 'Erro ao realizar login.');
    }
  },
};

module.exports = authController;
