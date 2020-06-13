/* eslint-disable */
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(
      'ALTER TABLE "applications" ADD "startCommand" VARCHAR (255); ' +
        'ALTER TABLE "applications" ADD "stopCommand" VARCHAR (255);'
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
