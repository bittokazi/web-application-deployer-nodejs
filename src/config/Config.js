import "dotenv/config";

export const Config = () => {
  return {
    _PORT: process.env._PORT || 8081,
    _JWT_SECRET: process.env._JWT_SECRET,
    _SOCKET_AUTH_TIMEOUT: process.env._SOCKET_AUTH_TIMEOUT,
    _BACKEND_URL: process.env._BACKEND_URL,
    _SERVICE_AUTH_KEY: process.env._SERVICE_AUTH_KEY,
    _APPLICATION_FOLDER: process.env._APPLICATION_FOLDER,
  };
};

export default Config;
