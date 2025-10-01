const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { User } = require('../db/models');
const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require('../utils/jwt');

class AuthService {
  async register(data) {
    const existingUser = await User.findOne({ where: { email: data.email } });

    if (existingUser) {
      const error = new Error('Email already registered');
      error.statusCode = 409;
      error.code = 'EMAIL_EXISTS';
      throw error;
    }

    const passwordHash = await bcrypt.hash(data.password, 10);

    const user = await User.create({
      name: data.name,
      email: data.email,
      passwordHash,
      role: 'user'
    });

    const accessToken = generateAccessToken(user.id, user.role);
    const refreshToken = generateRefreshToken(user.id);

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    };
  }

  async login(email, password) {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      const error = new Error('Invalid credentials');
      error.statusCode = 401;
      error.code = 'INVALID_CREDENTIALS';
      throw error;
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      const error = new Error('Invalid credentials');
      error.statusCode = 401;
      error.code = 'INVALID_CREDENTIALS';
      throw error;
    }

    const accessToken = generateAccessToken(user.id, user.role);
    const refreshToken = generateRefreshToken(user.id);

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    };
  }

  async refresh(refreshToken) {
    const decoded = verifyRefreshToken(refreshToken);

    if (!decoded) {
      const error = new Error('Invalid or expired refresh token');
      error.statusCode = 401;
      error.code = 'INVALID_REFRESH_TOKEN';
      throw error;
    }

    const user = await User.findByPk(decoded.userId);

    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      error.code = 'USER_NOT_FOUND';
      throw error;
    }

    const accessToken = generateAccessToken(user.id, user.role);

    return { accessToken };
  }

  async forgotPassword(email) {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return { message: 'If email exists, reset link will be sent' };
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    const resetPasswordExpires = new Date(Date.now() + 3600000);

    await user.update({
      resetPasswordToken,
      resetPasswordExpires
    });

    return {
      message: 'If email exists, reset link will be sent',
      resetToken
    };
  }

  async resetPassword(token, newPassword) {
    const resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      where: {
        resetPasswordToken,
        resetPasswordExpires: { [require('sequelize').Op.gt]: new Date() }
      }
    });

    if (!user) {
      const error = new Error('Invalid or expired reset token');
      error.statusCode = 400;
      error.code = 'INVALID_RESET_TOKEN';
      throw error;
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);

    await user.update({
      passwordHash,
      resetPasswordToken: null,
      resetPasswordExpires: null
    });

    return { message: 'Password reset successfully' };
  }

  async getProfile(userId) {
    const user = await User.findByPk(userId, {
      attributes: ['id', 'name', 'email', 'role', 'avatarUrl', 'createdAt']
    });

    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      error.code = 'USER_NOT_FOUND';
      throw error;
    }

    return user;
  }

  async updateProfile(userId, data) {
    const user = await User.findByPk(userId);

    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      error.code = 'USER_NOT_FOUND';
      throw error;
    }

    if (data.email && data.email !== user.email) {
      const existingUser = await User.findOne({ where: { email: data.email } });
      if (existingUser) {
        const error = new Error('Email already in use');
        error.statusCode = 409;
        error.code = 'EMAIL_EXISTS';
        throw error;
      }
    }

    await user.update({
      name: data.name || user.name,
      email: data.email || user.email,
      avatarUrl: data.avatarUrl || user.avatarUrl
    });

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatarUrl: user.avatarUrl
    };
  }

  async changePassword(userId, currentPassword, newPassword) {
    const user = await User.findByPk(userId);

    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      error.code = 'USER_NOT_FOUND';
      throw error;
    }

    const isPasswordValid = await bcrypt.compare(currentPassword, user.passwordHash);

    if (!isPasswordValid) {
      const error = new Error('Current password is incorrect');
      error.statusCode = 401;
      error.code = 'INVALID_PASSWORD';
      throw error;
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);
    await user.update({ passwordHash });

    return { message: 'Password changed successfully' };
  }
}

module.exports = new AuthService();
