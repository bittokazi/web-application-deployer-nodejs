const fs = require("fs");
require("dotenv").config();

module.exports = {
  development: {
    username: process.env._DB_USERNAME,
    password: process.env._DB_PASSWORD,
    database: process.env._DB_NAME,
    host: process.env._DB_HOSTNAME,
    port: process.env._DB_PORT || 5432,
    dialect: "postgres",
  },
  test: {
    username: process.env._DB_USERNAME,
    password: process.env._DB_PASSWORD,
    database: process.env._DB_NAME,
    host: process.env._DB_HOSTNAME,
    port: process.env._DB_PORT || 5432,
    dialect: "postgres",
  },
  production: {
    username: process.env._DB_USERNAME,
    password: process.env._DB_PASSWORD,
    database: process.env._DB_NAME,
    host: process.env._DB_HOSTNAME,
    port: process.env._DB_PORT || 5432,
    dialect: "postgres",
  },
};
