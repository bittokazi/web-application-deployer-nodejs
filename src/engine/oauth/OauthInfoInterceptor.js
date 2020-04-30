import pg from "./../PgPromise";

export const UserInfo = (req, res, next) => {
  var token = req.header("Authorization");
  var matches = token.match(/Bearer\s(\S+)/);

  if (matches) {
    pg.query("SELECT user_id FROM oauth_tokens WHERE access_token = $1", [
      matches[1]
    ])
      .then(function(result) {
        pg.query("SELECT * FROM users WHERE id = $1", [result[0].user_id])
          .then(function(result1) {
            if (result1.length > 0) {
              req.user = result1[0];
            } else {
              req.user = undefined;
            }
            next();
          })
          .catch(function(error) {
            req.user = undefined;
            next();
          });
      })
      .catch(function(error) {
        req.user = undefined;
        next();
      });
  }
};

export default UserInfo;
