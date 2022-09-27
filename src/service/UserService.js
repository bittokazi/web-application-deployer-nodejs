import bcrypt from "bcrypt";
import * as db from "../models";
import { validationResult } from "express-validator";
import { KJUR } from "jsrsasign";
import Config from "../config/Config";
import UserRole from "./UserRole";

export const getAllUsers = (req, success, error) => {
  let where = {};
  db.user
    .findAll({
      attributes: ["id", "username", "email", "firstName", "lastName"],
      raw: true,
      order: [["id", "DESC"]],
    })
    .then((result) => {
      success(result);
    })
    .catch((err) => {
      error(err);
    });
};

export const addUserProtected = (payload, success, error) => {
  checkEmail(
    payload,
    (result) => {
      if (result) {
        if (result) error("Email Exist", 400);
      } else {
        checkUsername(
          payload,
          (result) => {
            if (result) {
              if (result) error("Username Exist", 400);
            } else {
              payload.role = UserRole.superAdmin;
              payload.changePassword = true;
              payload.password = bcrypt.hashSync(payload.password, 10);
              db.user
                .create(payload)
                .then((result) => {
                  success(result);
                })
                .catch((err) => {
                  error(err);
                });
            }
          },
          (err) => {
            error(err);
          }
        );
      }
    },
    (err) => {
      error(err);
    }
  );
};

export const generateChatServerToken = (user) => {
  const header = JSON.stringify({ alg: "HS256", typ: "JWT" });
  const payload = JSON.stringify({
    tenant: user.tenant,
    id: user.id,
    name: user.username,
  });
  const authToken = KJUR.jws.JWS.sign(
    "HS256",
    header,
    payload,
    Config()._JWT_SECRET
  );
  return authToken;
};

export const checkUserAndEmailExist = (payload, success, error) => {
  db.user
    .findAll({
      where: db.Sequelize.or(
        { username: payload.username },
        { email: payload.email }
      ),
      attributes: ["id", "username", "email"],
      include: [{ all: true }],
      order: [["id", "DESC"]],
    })
    .then((result) => {
      success(result);
    })
    .catch((err) => {
      error(err);
    });
};

export const checkUsername = (payload, success, error) => {
  db.user
    .findAll({
      where: { username: payload.username },
      attributes: ["id"],
      include: [{ all: true }],
      order: [["id", "DESC"]],
    })
    .then((result) => {
      if (result.length > 0) success(true);
      else success(false);
    })
    .catch((err) => {
      error(err);
    });
};

export const checkEmail = (payload, success, error) => {
  db.user
    .findAll({
      where: { email: payload.email },
      attributes: ["id"],
      include: [{ all: true }],
      order: [["id", "DESC"]],
    })
    .then((result) => {
      if (result.length > 0) success(true);
      else success(false);
    })
    .catch((err) => {
      error(err);
    });
};

export const updateUser = (req, payload, id, success, error) => {
  db.user
    .findAll({
      where: {
        id: id,
      },
      order: [["id", "DESC"]],
    })
    .then((result) => {
      if (result.length == 0) {
        error("not exist", 404);
        return;
      }
      payload.username = result[0].username;
      if (payload.password != "") {
        if (req.user.username != payload.username)
          payload.changePassword = true;
        payload.password = bcrypt.hashSync(payload.password, 10);
      } else {
        delete payload.password;
      }
      if (payload.email != result[0].email) {
        checkEmail(
          payload,
          (result) => {
            if (result) {
              if (result) error("Email Exist", 400);
            } else {
              db.user
                .update(payload, {
                  where: {
                    id,
                  },
                })
                .then((result) => {
                  success(result);
                })
                .catch((err) => {
                  error(err);
                });
            }
          },
          (err) => {
            error(err);
          }
        );
      } else {
        db.user
          .update(payload, {
            where: {
              id,
            },
          })
          .then((result) => {
            success(result);
          })
          .catch((err) => {
            error(err);
          });
      }
    })
    .catch((err) => {
      error(err);
    });
};

export const updatePassword = (req, payload, success, error) => {
  db.user
    .findAll({
      where: {
        id: req.user.id,
      },
      order: [["id", "DESC"]],
    })
    .then((result) => {
      if (result.length == 0) {
        error("not exist", 404);
        return;
      }
      console.log(
        payload.password,
        result[0].passwor,
        bcrypt.compareSync(payload.password, result[0].password)
      );
      if (bcrypt.compareSync(payload.password, result[0].password)) {
        error("Old password given. Please set a new one", 400);
      } else {
        payload.changePassword = false;
        payload.password = bcrypt.hashSync(payload.password, 10);
        db.user
          .update(payload, {
            where: {
              id: req.user.id,
            },
          })
          .then((result) => {
            success(result);
          })
          .catch((err) => {
            error(err);
          });
      }
    })
    .catch((err) => {
      error(err);
    });
};

export const getUser = (id, success, error) => {
  db.user
    .findAll({
      where: {
        id: id,
      },
      order: [["id", "DESC"]],
    })
    .then((result) => {
      if (result.length == 0) {
        error("not exist", 404);
        return;
      }
      success(result[0]);
    })
    .catch((err) => {
      error(err);
    });
};
