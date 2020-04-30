import { HelloWorld } from "./../controllers/HelloController";

import userRoutes from "./User";

import UserInfo from "./../engine/oauth/OauthInfoInterceptor";
import TenantUserRole from "./../middlewares/TenantUserRole";
import TenantIdentifierInterceptor from "./../middlewares/TenantIdentifierInterceptor";
import authRoutes from "./Auth";
import applicationRoutes from "./Application";
import { SocketIoAccacher } from "../middlewares/SocketIoAccacher";
import { githubDeployController } from "../controllers/GithubDeployController";

export const Routes = (app, socketIoCallback) => {
  app.get("/health", HelloWorld);
  app.post(
    "/github-deploy/:id",
    SocketIoAccacher(socketIoCallback),
    githubDeployController
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
