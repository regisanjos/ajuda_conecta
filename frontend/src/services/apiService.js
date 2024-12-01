import axios from 'axios';
import { auth } from '../scripts/firebase'; // Aqui importamos a instância do Firebase

const apiUrl = 'http://localhost:5000'; // Substitua pela URL do seu back-end

// Função para obter o ID Token do Firebase
const getToken = async () => {
  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken(); // Pega o ID token do Firebase
    return token;
  }
  throw new Error('Usuário não autenticado');
};

// Função para fazer login no back-end
const login = async (email, password) => {
  try {
    const token = await getToken();  // Obtém o ID Token do Firebase

    const response = await axios.post(
      `${apiUrl}/login`, // Supondo que tenha a rota de login no seu back-end
      { email, password },
      {
        headers: {
          Authorization: `Bearer ${token}`, // Passando o token no cabeçalho
        },
      }
    );
    return response.data; // Retorna os dados da resposta
  } catch (error) {
    console.error("Erro ao realizar login:", error);
    throw error;
  }
};

// Função para registrar um novo usuário
const signup = async (email, password, name) => {
  try {
    const token = await getToken();  // Obtém o ID Token do Firebase

    const response = await axios.post(
      `${apiUrl}/signup`, // Supondo que tenha a rota de cadastro no seu back-end
      { email, password, name },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data; // Retorna os dados da resposta
  } catch (error) {
    console.error("Erro ao realizar cadastro:", error);
    throw error;
  }
};

// Função para pegar informações do usuário autenticado
const getUserData = async () => {
  try {
    const token = await getToken();  // Obtém o ID Token do Firebase

    const response = await axios.get(`${apiUrl}/user`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao obter dados do usuário:", error);
    throw error;
  }
};

// Função para realizar logout
const logout = async () => {
  try {
    await auth.signOut(); // Chama o método do Firebase para realizar logout
    console.log('Usuário deslogado com sucesso');
  } catch (error) {
    console.error('Erro ao realizar logout:', error);
    throw error;
  }
};

// Expondo as funções criadas para serem usadas no front-end
export {
  login,
  signup,
  getUserData,
  logout,
};
