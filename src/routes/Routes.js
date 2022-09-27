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
    app.oauth.authenticate(),
    TenantIdentifierInterceptor,
    UserInfo,
    TenantUserRole,
    userRoutes
  );
  app.use(
    "/api/fcm",
    app.oauth.authenticate(),
    TenantIdentifierInterceptor,
    UserInfo,
    TenantUserRole,
    fcmRoutes
  );
  app.use(
    "/api/applications",
    app.oauth.authenticate(),
    TenantIdentifierInterceptor,
    UserInfo,
    TenantUserRole,
    SocketIoAccacher(socketIoCallback),
    applicationRoutes
  );
  app.use("/api/login", authRoutes);
};

export default Routes;
