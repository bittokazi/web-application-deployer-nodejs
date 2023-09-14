import { HelloWorld } from "./../controllers/HelloController";

import userRoutes from "./User";
import fcmRoutes from "./Fcm";

import UserInfo from "./../engine/oauth/OauthInfoInterceptor";
import TenantUserRole from "./../middlewares/TenantUserRole";
import TenantIdentifierInterceptor from "./../middlewares/TenantIdentifierInterceptor";
import authRoutes from "./Auth";
import applicationRoutes from "./Application";
import { SocketIoAccacher } from "../middlewares/SocketIoAccacher";
import { githubDeployController } from "../controllers/GithubDeployController";
import { dockerDeployController } from "../controllers/DockerDeployController";
import { gitlabDeployController } from "../controllers/GitlabDeployController";
import Config from "../config/Config";
import { SSOTokenInterceptor } from "../engine/oauth/SSOTokenInterceptor";

export const Routes = (app, socketIoCallback) => {
  app.get("/health", HelloWorld);
  app.post(
    "/github-deploy/:id",
    SocketIoAccacher(socketIoCallback),
    githubDeployController
  );
  app.post(
    "/gitlab-deploy/:id",
    SocketIoAccacher(socketIoCallback),
    gitlabDeployController
  );
  app.post(
    "/docker-deploy/:id/secret/:secret",
    SocketIoAccacher(socketIoCallback),
    dockerDeployController
  );
  app.use(
    "/api/users",
    Config()._SSO_LOGIN_ENABLED
      ? SSOTokenInterceptor
      : app.oauth.authenticate(),
    UserInfo,
    userRoutes
  );
  app.use(
    "/api/fcm",
    Config()._SSO_LOGIN_ENABLED
      ? SSOTokenInterceptor
      : app.oauth.authenticate(),
    UserInfo,
    fcmRoutes
  );
  app.use(
    "/api/applications",
    Config()._SSO_LOGIN_ENABLED
      ? SSOTokenInterceptor
      : app.oauth.authenticate(),
    UserInfo,
    SocketIoAccacher(socketIoCallback),
    applicationRoutes
  );
  app.use("/api/login", authRoutes);
};

export default Routes;
