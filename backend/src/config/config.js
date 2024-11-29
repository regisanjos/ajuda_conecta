require('dotenv').config();

const config = {
  jwt: {
    secret: process.env.JWT_SECRET || 'default_jwt_secret',
    expiration: process.env.JWT_EXPIRATION || '1h',
  },
  email: {
    host: process.env.EMAIL_HOST || 'smtp.example.com',
    port: process.env.EMAIL_PORT || 587,
    user: process.env.EMAIL_USER || 'user@example.com',
    pass: process.env.EMAIL_PASS || 'password',
  },
  database: {
    url: process.env.DATABASE_URL || 'mysql://root:@localhost:3306/ajudacatatrofes',
  },
  port: process.env.PORT || 3000,
};

module.exports = config;
