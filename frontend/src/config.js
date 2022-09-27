const dev = {
  API_BASE_URL: "localhost:8081",
  API_BASE_URL_PROTOCOL: "http://",
  CHAT_SERVER_URL: "http://localhost:8081",
  DOCKER_ENV: true,
};

const stage = {
  API_BASE_URL: "cloud.bitto.website",
  API_BASE_URL_PROTOCOL: "https://",
  CHAT_SERVER_URL: "https://cloud.bitto.website",
  DOCKER_ENV: false,
};

const prod = {
  API_BASE_URL: "localhost:8081",
  API_BASE_URL_PROTOCOL: "http://",
  CHAT_SERVER_URL: "http://localhost:8081",
  DOCKER_ENV: false,
};

const weallride = {
  API_BASE_URL: "deploy.weallride.org",
  API_BASE_URL_PROTOCOL: "https://",
  CHAT_SERVER_URL: "https://deploy.weallride.org",
  DOCKER_ENV: false,
};

const oracle_test = {
  API_BASE_URL: "infra.bittokazi.com",
  API_BASE_URL_PROTOCOL: "https://",
  CHAT_SERVER_URL: "https://infra.bittokazi.com",
  DOCKER_ENV: false,
};

const docker_env = {
  API_BASE_URL: "/",
  API_BASE_URL_PROTOCOL: "",
  CHAT_SERVER_URL: "/",
  DOCKER_ENV: true,
};

let config = {};

if (process.env.REACT_APP_STAGE === "production") {
  config = prod;
} else if (process.env.REACT_APP_STAGE === "staging") {
  config = stage;
} else if (process.env.REACT_APP_STAGE === "weallride") {
  config = weallride;
} else if (process.env.REACT_APP_STAGE === "oracle_test") {
  config = oracle_test;
} else if (process.env.REACT_APP_STAGE === "docker_build") {
  config = docker_env;
} else {
  config = dev;
}

export default {
  ...config,
};
