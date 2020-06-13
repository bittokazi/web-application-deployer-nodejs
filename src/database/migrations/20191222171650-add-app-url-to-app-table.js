/* eslint-disable */
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(
      'ALTER TABLE "applications" ADD "healthUrl" VARCHAR (255);'
    );
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  },
};
