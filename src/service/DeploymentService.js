import * as db from "../models";
import { Config } from "./../config/Config";

export const getAllDeployments = (req, success, error) => {
  db.deployment
    .findAll({
      where: {
        name: req.param("name"),
      },
      order: [["id", "DESC"]],
      limit: 10,
    })
    .then((result) => {
      success(result);
    })
    .catch((err) => {
      error(err);
    });
};
