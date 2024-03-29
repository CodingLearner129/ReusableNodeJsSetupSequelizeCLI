import dotenv from "dotenv";
import dotenvExpand from "dotenv-expand";
dotenvExpand.expand(dotenv.config('./../../.env'));

const CONFIG = {};

CONFIG.app = process.env.APP_ENV;
CONFIG.port = process.env.PORT || 3000;
CONFIG.host = process.env.HOST || "127.0.0.1";
CONFIG.bcrypt_salt_round = process.env.BCRYPT_SALT_ROUND || 10;
CONFIG.locale = process.env.LOCALE || 'en';
CONFIG.jwt_encryption = process.env.JWT_ENCRYPTION || 'wXDITglp';
CONFIG.mail_from = process.env.MAIL_FROM_ADDRESS;
CONFIG.mail_host = process.env.MAIL_HOST;
CONFIG.mail_port = process.env.MAIL_PORT;
CONFIG.mail_username = process.env.MAIL_USERNAME;
CONFIG.mail_password = process.env.MAIL_PASSWORD;

export default {
  development: {
    username: process.env.DB_USERNAME || "root",
    password: process.env.DB_PASSWORD || null,
    database: process.env.DB_DATABASE || "sequelize_setup_development",
    host: process.env.DB_HOST || "127.0.0.1",
    port: process.env.DB_PORT || 3306,
    dialect: process.env.DB_CONNECTION || "mysql",
    charset: process.env.DB_CHARSET || 'utf8mb4',
    collation: process.env.DB_COLLATION || 'utf8mb4_unicode_ci',
    logging: process.env.DB_LOGGING == 'true' || false,
    pool: {
      handleDisconnects: true,
      max: 100,
      min: 1,
      idle: 10000,
      acquire: 20000,
    },
    timezone: process.env.TIMEZONE || "+05:30",
    quoteEnumNames: true
  },
  test: {
    username: process.env.DB_USERNAME || "root",
    password: process.env.DB_PASSWORD || null,
    database: process.env.DB_DATABASE || "sequelize_setup_test",
    host: process.env.DB_HOST || "127.0.0.1",
    port: process.env.DB_PORT || 3306,
    dialect: process.env.DB_CONNECTION || "mysql",
    charset: process.env.DB_CHARSET || 'utf8mb4',
    collation: process.env.DB_COLLATION || 'utf8mb4_unicode_ci',
    logging: process.env.DB_LOGGING == 'true' || false,
    pool: {
      handleDisconnects: true,
      max: 100,
      min: 1,
      idle: 10000,
      acquire: 20000,
    },
    timezone: process.env.TIMEZONE || "+05:30",
    quoteEnumNames: true
  },
  production: {
    username: process.env.DB_USERNAME || "root",
    password: process.env.DB_PASSWORD || null,
    database: process.env.DB_DATABASE || "sequelize_setup_production",
    host: process.env.DB_HOST || "127.0.0.1",
    port: process.env.DB_PORT || 3306,
    dialect: process.env.DB_CONNECTION || "mysql",
    charset: process.env.DB_CHARSET || 'utf8mb4',
    collation: process.env.DB_COLLATION || 'utf8mb4_unicode_ci',
    logging: process.env.DB_LOGGING == 'true' || false,
    ssl: true,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
    pool: {
      handleDisconnects: true,
      max: 100,
      min: 1,
      idle: 10000,
      acquire: 20000,
    },
    timezone: process.env.TIMEZONE || "+05:30",
    quoteEnumNames: true
  },
  CONFIG,
}
