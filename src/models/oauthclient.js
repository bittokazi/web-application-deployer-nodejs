"use strict";
module.exports = (sequelize, DataTypes) => {
  const OauthClient = sequelize.define(
    "oauth_client",
    {
      client_id: DataTypes.STRING,
      client_secret: DataTypes.STRING,
      redirect_uri: DataTypes.STRING,
      grant_types: DataTypes.STRING,
      company_id: DataTypes.INTEGER
    },
    {}
  );
  OauthClient.associate = function(models) {
    // associations can be defined here
  };
  return OauthClient;
};
