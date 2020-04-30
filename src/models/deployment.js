"use strict";
module.exports = (sequelize, DataTypes) => {
  const Deployment = sequelize.define(
    "deployment",
    {
      name: DataTypes.STRING,
      timestamp: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {}
  );
  Deployment.associate = function (models) {};
  return Deployment;
};
