import {
  authorizeUserService,
  checkUserGetOauthCredentials,
  refreshTokenService,
  ssoLoginCall,
} from "./../service/AuthService";
import { subscribeTopic, unSubscribeTopic } from "../service/FirebaseService";

export const login = (req, res, next) => {
  checkUserGetOauthCredentials(
    {
      username: req.body.username,
      password: req.body.password,
    },
    (result) => {
      return res.status(200).json(result);
    },
    (notFound) => {
      return res.status(401).json({
        message: "Authorization Failed",
      });
    },
    (error) => {
      return res.status(500).json(error);
    }
  );
};

export const subscribeFcm = (req, res, next) => {
  subscribeTopic(req.body.token)
    .then((result) => {
      return res.status(200).json(result);
    })
    .catch((error) => {
      return res.status(500).json(error);
    });
};

export const unSubscribeFcm = (req, res, next) => {
  unSubscribeTopic(req.body.token)
    .then((result) => {
      return res.status(200).json(result);
    })
    .catch((error) => {
      return res.status(500).json(error);
    });
};

export const ssoLogin = (req, res, next) => {
  ssoLoginCall(res);
};

export const authorizeUserController = (req, res, next) => {
  authorizeUserService(req, res);
};

export const refreshTokenController = (req, res, next) => {
  refreshTokenService(req, res);
};
