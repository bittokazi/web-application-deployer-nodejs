"use strict";
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "user",
    {
      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING,
      username: DataTypes.STRING,
      email: DataTypes.STRING,
      password: {
        type: DataTypes.STRING,
      },
      changePassword: DataTypes.BOOLEAN,
      role: DataTypes.STRING,
    },
    {}
  );
  User.prototype.toJSON = function () {
    let json = this.get();
    delete json.password;
    return json;
  };
  User.associate = function (models) {};
  return User;
};
