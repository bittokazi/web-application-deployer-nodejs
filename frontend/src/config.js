const dev = {
  API_BASE_URL: "localhost:8081",
  API_BASE_URL_PROTOCOL: "http://",
  CHAT_SERVER_URL: "http://localhost:8081",
};

const stage = {
  API_BASE_URL: "cloud.bitto.website",
  API_BASE_URL_PROTOCOL: "https://",
  CHAT_SERVER_URL: "https://cloud.bitto.website",
};

const prod = {
  API_BASE_URL: "localhost:8081",
  API_BASE_URL_PROTOCOL: "http://",
  CHAT_SERVER_URL: "http://localhost:8081",
};

const weallride = {
  API_BASE_URL: "deploy.weallride.org",
  API_BASE_URL_PROTOCOL: "https://",
  CHAT_SERVER_URL: "https://deploy.weallride.org",
};

const oracle_test = {
  API_BASE_URL: "infra.bitto.website",
  API_BASE_URL_PROTOCOL: "https://",
  CHAT_SERVER_URL: "http://infra.bitto.website",
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
} else {
  config = dev;
}

export default {
  ...config,
};
