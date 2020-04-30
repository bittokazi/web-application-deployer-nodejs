"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("oauth_tokens", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      access_token: {
        allowNull: false,
        type: Sequelize.STRING
      },
      access_token_expires_on: {
        allowNull: false,
        type: Sequelize.DATE
      },
      client_id: {
        allowNull: false,
        type: Sequelize.STRING
      },
      refresh_token: {
        type: Sequelize.STRING
      },
      refresh_token_expires_on: {
        type: Sequelize.DATE
      },
      user_id: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        type: Sequelize.DATE
      },
      updatedAt: {
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("oauth_tokens");
  }
};
