"use strict";
module.exports = (sequelize, DataTypes) => {
  const Application = sequelize.define(
    "application",
    {
      name: DataTypes.STRING,
      secret: DataTypes.STRING,
      location: DataTypes.STRING,
      script: DataTypes.STRING,
      branch: DataTypes.STRING,
      environments: DataTypes.STRING,
      isDeploying: DataTypes.BOOLEAN,
      healthUrl: DataTypes.STRING,
      startCommand: DataTypes.STRING,
      stopCommand: DataTypes.STRING,
    },
    {}
  );
  Application.associate = function (models) {};
  return Application;
};
