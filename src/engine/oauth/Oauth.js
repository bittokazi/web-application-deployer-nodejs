import OAuthServer from "express-oauth-server";

export const Oauth = app => {
  app.oauth = new OAuthServer({
    debug: true,
    model: require("./model"),
    accessTokenLifetime: 60 * 10,
    refreshTokenLifetime: 365 * 24 * 3600
  });

  app.post("/oauth/token", app.oauth.token());
};

export default Oauth;
