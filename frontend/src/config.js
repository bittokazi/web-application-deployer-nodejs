const dev = {
  API_BASE_URL: "localhost:8081",
  API_BASE_URL_PROTOCOL: "http://",
  CHAT_SERVER_URL: "http://localhost:8081",
  DOCKER_ENV: false,
  SHOW_UPDATE: true,
  SSO_LOGIN: false,
};

const generic = {
  API_BASE_URL: "infra.bittokazi.com",
  API_BASE_URL_PROTOCOL: "",
  CHAT_SERVER_URL: "/",
  DOCKER_ENV: false,
  SHOW_UPDATE: false,
  SSO_LOGIN: false,
};

const sso = {
  API_BASE_URL: "/",
  API_BASE_URL_PROTOCOL: "",
  CHAT_SERVER_URL: "/",
  DOCKER_ENV: false,
  SHOW_UPDATE: false,
  SSO_LOGIN: true,
};

const docker_env = {
  API_BASE_URL: "/",
  API_BASE_URL_PROTOCOL: "http:",
  CHAT_SERVER_URL: "/",
  DOCKER_ENV: true,
  SHOW_UPDATE: false,
  SSO_LOGIN: false,
};

let config = {};

if (process.env.REACT_APP_STAGE === "generic") {
  config = generic;
} else if (process.env.REACT_APP_STAGE === "sso") {
  config = sso;
} else if (process.env.REACT_APP_STAGE === "docker_build") {
  config = docker_env;
} else {
  config = dev;
}

export default {
  ...config,
};
