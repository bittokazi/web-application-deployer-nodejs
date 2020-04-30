import bcrypt from "bcrypt";
import * as db from "../models";
import { validationResult } from "express-validator";
import { KJUR } from "jsrsasign";
import Config from "../config/Config";

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

export const addUserProtected = (req, res, payload, tenant, success, error) => {
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
