const jwt = require('jsonwebtoken');
const AppError = require('../utils/AppError'); // Para tratar erros personalizados

const authMiddleware = (req, res, next) => {
  // Verifica se o cabeçalho de autorização está presente
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    // Se o token não estiver presente no cabeçalho, retorna um erro 401 (Não autorizado)
    return res.status(401).json({ message: 'Token de autenticação não fornecido.' });
  }

  // O token normalmente é enviado como "Bearer <token>"
  const token = authHeader.split(' ')[1]; // Extrai o token do cabeçalho

  if (!token) {
    return res.status(401).json({ message: 'Token de autenticação não fornecido.' });
  }

  // Verifica a validade do token
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Token inválido.' });
    }

    // Se o token for válido, armazena os dados do usuário decodificados na requisição
    req.user = decoded; // O "decoded" contém os dados do usuário, como "id" e "role"

    // Continua para a próxima rota ou middleware
    next();
  });
};

module.exports = authMiddleware;
