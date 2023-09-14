import "dotenv/config";

export const Config = () => {
  return {
    _PORT: process.env._PORT || 8081,
    _JWT_SECRET: process.env._JWT_SECRET,
    _SOCKET_AUTH_TIMEOUT: process.env._SOCKET_AUTH_TIMEOUT,
    _BACKEND_URL: process.env._BACKEND_URL,
    _SERVICE_AUTH_KEY: process.env._SERVICE_AUTH_KEY,
    _APPLICATION_FOLDER: process.env._APPLICATION_FOLDER,
    _DEFAULT_OAUTH_CLIENT_ID: process.env._DEFAULT_OAUTH_CLIENT_ID,
    _DEFAULT_OAUTH_CLIENT_SECRET: process.env._DEFAULT_OAUTH_CLIENT_SECRET,
    _FCM_SERVER_KEY: process.env._FCM_SERVER_KEY,
    _SELF_DEPLOY_SCRIPT: process.env._SELF_DEPLOY_SCRIPT,
    _GITHUB_USERNAME: process.env._GITHUB_USERNAME,
    _GITHUB_TOKEN: process.env._GITHUB_TOKEN,
    _GITLAB_USERNAME: process.env._GITLAB_USERNAME,
    _GITLAB_TOKEN: process.env._GITLAB_TOKEN,
    _SSO_DOMAIN: process.env._SSO_DOMAIN,
    _SSO_CLIENT_ID: process.env._SSO_CLIENT_ID,
    _SSO_CLIENT_SECRET: process.env._SSO_CLIENT_SECRET,
    _SSO_CLIENT_SCOPE: process.env._SSO_CLIENT_SCOPE,
    _SSO_CLIENT_REDIRECT_URL: process.env._SSO_CLIENT_REDIRECT_URL,
    _SSO_LOGIN_ENABLED: process.env._SSO_LOGIN_ENABLED
      ? process.env._SSO_LOGIN_ENABLED.toLowerCase() == "true"
        ? true
        : false
      : false,
  };
};

export default Config;
