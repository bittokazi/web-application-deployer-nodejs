const dev = {
  API_BASE_URL: "localhost:8081",
  API_BASE_URL_PROTOCOL: "http://",
  CHAT_SERVER_URL: "http://localhost:8081",
  DOCKER_ENV: false,
  SHOW_UPDATE: true,
};

const generic = {
  API_BASE_URL: "/",
  API_BASE_URL_PROTOCOL: "",
  CHAT_SERVER_URL: "/",
  DOCKER_ENV: false,
  SHOW_UPDATE: false,
};

const docker_env = {
  API_BASE_URL: "/",
  API_BASE_URL_PROTOCOL: "",
  CHAT_SERVER_URL: "/",
  DOCKER_ENV: true,
  SHOW_UPDATE: false,
};

let config = {};

if (process.env.REACT_APP_STAGE === "generic") {
  config = generic;
} else if (process.env.REACT_APP_STAGE === "docker_build") {
  config = docker_env;
} else {
  config = dev;
}

export default {
  ...config,
};
