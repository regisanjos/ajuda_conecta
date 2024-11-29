const prisma = require('../config/db');
const Joi = require('joi');
const AppError = require('../utils/AppError');
const { hashPassword } = require('../utils/passwordUtils');

const userService = {
  async createUser(userData) {
    const existingUser = await prisma.user.findUnique({
      where: { email: userData.email },
    });

    if (existingUser) {
      throw new AppError('Email já está em uso.', 409);
    }

    const hashedPassword = await hashPassword(userData.password);

    const user = await prisma.user.create({
      data: { ...userData, password: hashedPassword },
    });

    return { id: user.id, email: user.email, name: user.name, role: user.role };
  },

  async updateUser(userId, userData) {
    if (userData.password) {
      userData.password = await hashPassword(userData.password);
    }

    try {
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: userData,
      });
      return { id: updatedUser.id, email: updatedUser.email, name: updatedUser.name };
    } catch (error) {
      throw new AppError('Erro ao atualizar usuário.', 500);
    }
  },
};

module.exports = userService;
