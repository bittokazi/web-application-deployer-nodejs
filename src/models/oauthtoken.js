"use strict";
module.exports = (sequelize, DataTypes) => {
  const OauthToken = sequelize.define(
    "oauth_token",
    {
      access_token: DataTypes.STRING,
      access_token_expires_on: DataTypes.DATE,
      client_id: DataTypes.STRING,
      refresh_token: DataTypes.STRING,
      refresh_token_expires_on: DataTypes.DATE,
      user_id: DataTypes.INTEGER
    },
    {}
  );
  OauthToken.associate = function(models) {
    // associations can be defined here
  };
  return OauthToken;
};
