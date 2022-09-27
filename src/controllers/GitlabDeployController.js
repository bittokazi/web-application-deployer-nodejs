import { gitlabDeployApplication } from "../service/ApplicationService";

export const gitlabDeployController = (req, res) => {
  gitlabDeployApplication(
    req,
    (result) => {
      res.status(200).json({ status: "ok" });
    },
    (error) => {
      res.status(200).json(error);
    }
  );
};
