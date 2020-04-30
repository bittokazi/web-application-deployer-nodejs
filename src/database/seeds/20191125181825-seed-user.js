"use strict";
const bcrypt = require("bcrypt");
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const userExist = await queryInterface.sequelize.query(
      `SELECT * FROM "users" WHERE username = 'admin'`,
      {
        type: queryInterface.sequelize.QueryTypes.SELECT
      }
    );
    if (userExist.length < 1) {
      return queryInterface.bulkInsert(
        "users",
        [
          {
            firstName: "Joe",
            lastName: "The Admin",
            username: "admin",
            password: bcrypt.hashSync("pass", 10),
            email: "demo@demo.com",
            changePassword: true,
            role: "superAdmin",
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
