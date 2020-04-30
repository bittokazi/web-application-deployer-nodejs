"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("applications", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        allowNull: false,
        unique: true,
        type: Sequelize.STRING,
      },
      secret: {
        type: Sequelize.STRING,
      },
      location: {
        type: Sequelize.STRING,
      },
      script: {
        type: Sequelize.STRING,
      },
      branch: {
        type: Sequelize.STRING,
      },
      environments: {
        type: Sequelize.STRING,
      },
      isDeploying: {
        type: Sequelize.BOOLEAN,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("applications");
  },
};
