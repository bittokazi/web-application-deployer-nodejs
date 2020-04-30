import bcrypt from "bcrypt";
const pg = require("./../PgPromise");

/*
 * Get access token.
 */

module.exports.getAccessToken = function(bearerToken) {
  console.log("getAccessToken");
  return pg
    .query(
      "SELECT access_token, access_token_expires_on, client_id, refresh_token, refresh_token_expires_on, user_id FROM oauth_tokens WHERE access_token = $1",
      [bearerToken]
    )
    .then(function(result) {
      let tkn = {};
      if (result.length > 0) {
        tkn = {
          accessToken: result[0].access_token,
          accessTokenExpiresAt: result[0].access_token_expires_on,
          client: {
            id: result[0].client_id
          },
          user: {
            id: result[0].user_id
          },
          refreshToken: result[0].refresh_token,
          refreshTokenExpiresAt: result[0].refresh_token_expires_on
        };
      }

      return result.length > 0 ? tkn : false;
    });
};

/**
 * Get client.
 */

module.exports.getClient = function*(clientId, clientSecret) {
  console.log("getClient");
  return pg
    .query(
      "SELECT client_id, client_secret, redirect_uri, grant_types FROM oauth_clients WHERE client_id = $1 AND client_secret = $2",
      [clientId, clientSecret]
    )
    .then(function(result) {
      var oAuthClient = result[0];
      if (!oAuthClient) {
        return;
      }
      return {
        id: result[0].client_id,
        secret: result[0].client_secret,
        grants: result[0].grant_types.split(",") // the list of OAuth2 grant types that should be allowed
      };
    });
};

/**
 * Get refresh token.
 */

module.exports.getRefreshToken = function*(bearerToken) {
  console.log("getRefreshToken");
  return pg
    .query(
      "SELECT access_token, access_token_expires_on, client_id, refresh_token, refresh_token_expires_on, user_id FROM oauth_tokens WHERE refresh_token = $1",
      [bearerToken]
    )
    .then(function(result) {
      let tkn = {};
      if (result.length > 0) {
        tkn = {
          accessToken: result[0].access_token,
          accessTokenExpiresAt: result[0].access_token_expires_on,
          client: {
            id: result[0].client_id
          },
          user: {
            id: result[0].user_id
          },
          refreshToken: result[0].refresh_token,
          refreshTokenExpiresAt: result[0].refresh_token_expires_on
        };
      }

      return result.length > 0 ? tkn : false;
    });
};

/*
 * Get user.
 */

module.exports.getUser = function*(username, password) {
  console.log("getUser");
  return pg
    .query("SELECT id, password FROM users WHERE username = $1", [username])
    .then(function(result) {
      if (result.length > 0) {
        if (bcrypt.compareSync(password, result[0].password)) {
          return result[0];
        } else {
          return false;
        }
      } else {
        return false;
      }
    });
};

/**
 * Save token.
 */

module.exports.saveToken = function*(token, client, user) {
  console.log("saveAccessToken");
  return pg
    .query(
      "INSERT INTO oauth_tokens(access_token, access_token_expires_on, client_id, refresh_token, refresh_token_expires_on, user_id) VALUES ($1, $2, $3, $4, $5, $6)",
      [
        token.accessToken,
        token.accessTokenExpiresAt,
        client.id,
        token.refreshToken,
        token.refreshTokenExpiresAt,
        user.id
      ]
    )
    .then(function(result) {
      console.log(result, "hh");
      let tkn = {
        accessToken: token.accessToken,
        accessTokenExpiresAt: token.accessTokenExpiresAt,
        client: {
          id: client.id
        },
        user: {
          id: user.id
        },
        refreshToken: token.refreshToken,
        refreshTokenExpiresAt: token.refreshTokenExpiresAt
      };
      return tkn; // TODO return object with client: {id: clientId} and user: {id: userId} defined
    });
};

module.exports.getUserFromClient = function*() {
  return true;
};

module.exports.revokeToken = function*(token) {
  console.log("revokeToken", token);
  // imaginary DB queries
  return pg
    .query("DELETE FROM oauth_tokens WHERE refresh_token = $1", [
      token.refreshToken
    ])
    .then(function(result) {
      return true;
    })
    .catch(function(err) {
      return false;
    });
};
