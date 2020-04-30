import bcrypt from "bcrypt";
import * as db from "../models";

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
