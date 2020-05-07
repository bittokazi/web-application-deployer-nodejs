import { dockerDeployApplication } from "../service/ApplicationService";

export const dockerDeployController = (req, res) => {
  res.status(200).json({ status: "ok" });
  return;
  dockerDeployApplication(
    req,
    (result) => {
      res.status(200).json({ status: "ok" });
    },
    (error) => {
      res.status(200).json(error);
    }
  );
};
