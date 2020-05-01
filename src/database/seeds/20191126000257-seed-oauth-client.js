"use strict";
require("dotenv").config();

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const userExist = await queryInterface.sequelize.query(
      `SELECT * FROM "oauth_clients" WHERE id = 1`,
      {
        type: queryInterface.sequelize.QueryTypes.SELECT,
      }
    );
    if (userExist.length < 1) {
      return queryInterface.bulkInsert(
        "oauth_clients",
        [
          {
            client_id: process.env._DEFAULT_OAUTH_CLIENT_ID,
            client_secret: process.env._DEFAULT_OAUTH_CLIENT_SECRET,
            redirect_uri: "n/a",
            grant_types: "password,refresh_token",
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
        {}
      );
    }
    return Promise.all([]);
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
  },
};
