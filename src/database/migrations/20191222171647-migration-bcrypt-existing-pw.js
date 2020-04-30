"use strict";
const bcrypt = require("bcrypt");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query(
      `SELECT * FROM "users"`,
      {
        type: queryInterface.sequelize.QueryTypes.SELECT
      }
    );
    if (users) {
      let allPromises = [];
      await users.forEach(async user => {
        await queryInterface.sequelize.transaction(async t => {
          let newPassword = bcrypt.hashSync(user.password, 10);
          allPromises.push(
            new Promise(resolve => {
              queryInterface.sequelize
                .query(
                  `UPDATE users SET password = '${newPassword}' WHERE id = ${user.id}`
                )
                .then(([results, metadata]) => {
                  resolve({});
                });
            })
          );
        });
      });
      return Promise.all(allPromises);
    } else {
      return Promise.all([]);
    }
  },

  down: (queryInterface, Sequelize) => {}
};
