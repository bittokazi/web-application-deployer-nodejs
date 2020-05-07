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
      attributes: ["id"],
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
