import { githubDeployApplication } from "../service/ApplicationService";

export const githubDeployController = (req, res) => {
  githubDeployApplication(
    req,
    (result) => {
      res.status(200).json({ status: "ok" });
    },
    (error) => {
      res.status(200).json(error);
    }
  );
};
