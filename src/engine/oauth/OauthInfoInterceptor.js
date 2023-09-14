import request from "request";
import Config from "../../config/Config";
import pg from "./../PgPromise";

export const UserInfo = (req, res, next) => {
  var token = req.header("Authorization");
  var matches = token.match(/Bearer\s(\S+)/);

  if (matches) {
    if (Config()._SSO_LOGIN_ENABLED) {
      let get_options = {
        headers: {
          Authorization: "Bearer " + matches[1],
        },
      };

      request.get(
        Config()._SSO_DOMAIN + "/api/users/whoami",
        get_options,
        function (error, response, body) {
          if (!error && response.statusCode == 200) {
            req.user = JSON.parse(body);
            next();
          } else if (!error && response.statusCode == 401) {
            return res.status(401).json({ error: "Unauthorized access" });
          } else if (!error && response.statusCode == 403) {
            return res.status(403).json({ error: "FORBIDDER" });
          } else {
            return res.status(503).json({ error: "Identity Server Error" });
          }
        }
      );
    } else {
      pg.query("SELECT user_id FROM oauth_tokens WHERE access_token = $1", [
        matches[1],
      ])
        .then(function (result) {
          pg.query("SELECT * FROM users WHERE id = $1", [result[0].user_id])
            .then(function (result1) {
              if (result1.length > 0) {
                req.user = result1[0];
              } else {
                req.user = undefined;
              }
              next();
            })
            .catch(function (error) {
              req.user = undefined;
              next();
            });
        })
        .catch(function (error) {
          req.user = undefined;
          next();
        });
    }
  }
};

export default UserInfo;
