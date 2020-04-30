"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const userExist = await queryInterface.sequelize.query(
      `SELECT * FROM "oauth_clients" WHERE id = 1`,
      {
        type: queryInterface.sequelize.QueryTypes.SELECT
      }
    );
    if (userExist.length < 1) {
      return queryInterface.bulkInsert(
        "oauth_clients",
        [
          {
            client_id: "b3yg23t4t34utv34jtv34jv3",
            client_secret: "hjb34h5hj34b6jh3b6jjb3jb6",
            redirect_uri: "n/a",
            grant_types: "password,refresh_token",
            createdAt: new Date(),
            updatedAt: new Date()
          }
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
  }
};
