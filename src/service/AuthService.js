import bcrypt from "bcrypt";
import * as db from "../models";
import Config from "./../config/Config";
import request from "request";
import base64 from "base-64";
import utf8 from "utf8";

export const checkUserGetOauthCredentials = (
  loginCredentials,
  success,
  notFound,
  error
) => {
  db.user
    .findAll({
      attributes: ["password"],
      where: {
        username: loginCredentials.username,
      },
      raw: true,
      order: [["id", "DESC"]],
    })
    .then((result) => {
      if (result.length > 0) {
        if (bcrypt.compareSync(loginCredentials.password, result[0].password)) {
          db.oauth_client
            .findAll({
              attributes: ["client_secret", "client_id"],
              where: {
                id: 1,
              },
            })
            .then((result1) => {
              if (result1.length > 0) {
                success(result1[0]);
              } else {
                notFound({});
              }
            })
            .catch((err) => {});
        } else {
          notFound({});
        }
      } else {
        notFound({});
      }
    })
    .catch((err) => {
      error(err);
    });
};

export const ssoLoginCall = (res) => {
  res.redirect(
    Config()._SSO_DOMAIN +
      "/oauth2/authorize?client_id=" +
      Config()._SSO_CLIENT_ID +
      "&response_type=code&scope=" +
      Config()._SSO_CLIENT_SCOPE +
      "&redirect_uri=" +
      Config()._SSO_CLIENT_REDIRECT_URL +
      "&state=n/a"
  );
};

export const authorizeUserService = (req, res) => {
  const token = `${Config()._SSO_CLIENT_ID}:${Config()._SSO_CLIENT_SECRET}`;
  const bytes = utf8.encode(token);
  const encoded = base64.encode(bytes);

  let formData = {
    grant_type: "authorization_code",
    code: req.query.code,
    redirect_uri: Config()._SSO_CLIENT_REDIRECT_URL,
  };
  let post_options = {
    url: Config()._SSO_DOMAIN + "/oauth2/token",
    method: "POST",
    json: false,
    headers: {
      Authorization: "Basic " + encoded,
    },
    formData: formData,
  };

  request.post(post_options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      let bodyJson = JSON.parse(body);
      res.cookie("access_token", bodyJson.access_token, {
        expires: new Date(Date.now() + 72 * 3600000),
      });
      res.cookie("refresh_token", bodyJson.refresh_token, {
        expires: new Date(Date.now() + 72 * 3600000),
      });
      res.cookie("expires_in", bodyJson.expires_in, {
        expires: new Date(Date.now() + 72 * 3600000),
      });
      res.cookie("token_type", bodyJson.token_type, {
        expires: new Date(Date.now() + 72 * 3600000),
      });
      res.redirect("/");
    } else {
      if (response.statusCode == 401) {
        return res.status(200).json({ error: "Unauthorized" });
      }
      return res.status(503).json({ error: "Indentity Service Error" });
    }
  });
};

export const refreshTokenService = (req, res) => {
  const token = `${Config()._SSO_CLIENT_ID}:${Config()._SSO_CLIENT_SECRET}`;
  const bytes = utf8.encode(token);
  const encoded = base64.encode(bytes);

  let formData = {
    grant_type: "refresh_token",
    refresh_token: req.body.refresh_token,
  };
  let post_options = {
    url: Config()._SSO_DOMAIN + "/oauth2/token",
    method: "POST",
    json: false,
    headers: {
      Authorization: "Basic " + encoded,
    },
    formData: formData,
  };

  request.post(post_options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      let bodyJson = JSON.parse(body);
      res.cookie("access_token", bodyJson.access_token, {
        expires: new Date(Date.now() + 72 * 3600000),
      });
      res.cookie("refresh_token", bodyJson.refresh_token, {
        expires: new Date(Date.now() + 72 * 3600000),
      });
      res.cookie("expires_in", bodyJson.expires_in, {
        expires: new Date(Date.now() + 72 * 3600000),
      });
      res.cookie("token_type", bodyJson.token_type, {
        expires: new Date(Date.now() + 72 * 3600000),
      });
      return res.status(200).json(bodyJson);
    } else {
      if (response.statusCode == 401) {
        return res.status(200).json({ error: "Unauthorized" });
      }
      return res.status(503).json({ error: "Indentity Service Error" });
    }
  });
};
