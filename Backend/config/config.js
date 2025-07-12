import dotenv from 'dotenv';
dotenv.config();

export default {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS || null,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST || '127.0.0.1',
    dialect: 'mysql'
  },
  test: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS || null,
    database: process.env.DB_NAME_TEST || 'stackit_test_db',
    host: process.env.DB_HOST || '127.0.0.1',
    dialect: 'mysql'
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS || null,
    database: process.env.DB_NAME_PROD || 'stackit_prod_db',
    host: process.env.DB_HOST || '127.0.0.1',
    dialect: 'mysql'
  }
};
