import {
  createApplication,
  getAllApplication,
  updateApplication,
  deployApplication,
  showApplication,
  selfDeployerService,
  startApplication,
  stopApplication,
  getLogFile,
} from "./../service/ApplicationService";
import { getAllDeployments } from "../service/DeploymentService";

export const addApplication = (req, res, next) => {
  createApplication(
    req.body,
    (result) => {
      return res.status(200).json(result);
    },
    (error, code = 500) => {
      console.error(error);
      return res.status(code).json({
        message: error,
      });
    }
  );
};

export const getAllApplicationController = (req, res, next) => {
  getAllApplication(
    (result) => {
      return res.status(200).json(result);
    },
    (error) => {
      return res.status(500).json(error);
    }
  );
};

export const getAllDeploymentsController = (req, res, next) => {
  getAllDeployments(
    req,
    (result) => {
      return res.status(200).json(result);
    },
    (error) => {
      return res.status(500).json(error);
    }
  );
};

export const updateApplicationController = (req, res, next) => {
  updateApplication(
    req.body,
    req.param("id"),
    (result) => {
      res.status(200).json(result);
    },
    (error) => {
      res.status(200).json(error);
    }
  );
};

export const deployApplicationCon = (req, res, next) => {
  startApplication(
    req,
    req.body,
    req.param("id"),
    (result) => {
      res.status(200).json(result);
    },
    (error) => {
      res.status(200).json(error);
    }
  );
};

export const startApplicationCon = (req, res, next) => {
  startApplication(
    req,
    req.body,
    req.param("id"),
    (result) => {
      res.status(200).json(result);
    },
    (error) => {
      res.status(200).json(error);
    }
  );
};

export const stopApplicationCon = (req, res, next) => {
  stopApplication(
    req,
    req.body,
    req.param("id"),
    (result) => {
      res.status(200).json(result);
    },
    (error) => {
      res.status(200).json(error);
    }
  );
};

export const showApplicationCon = (req, res, next) => {
  showApplication(
    req.param("id"),
    (result) => {
      res.status(200).json(result);
    },
    (error) => {
      res.status(200).json(error);
    }
  );
};

export const selfDeployerServiceController = (req, res, next) => {
  selfDeployerService(
    req,
    (result) => {
      res.status(200).json(result);
    },
    (error) => {
      res.status(200).json(error);
    }
  );
};

export const getLogFileCon = (req, res, next) => {
  getLogFile(
    req.param("id"),
    (result) => {
      res.status(200).json(result);
    },
    (error) => {
      res.status(200).json(error);
    }
  );
};
