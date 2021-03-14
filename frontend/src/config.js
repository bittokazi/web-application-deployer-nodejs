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
  API_BASE_URL: "weallride.ga",
  API_BASE_URL_PROTOCOL: "https://",
  CHAT_SERVER_URL: "https://weallride.ga",
};

let config = {};

if (process.env.REACT_APP_STAGE === "production") {
  config = prod;
} else if (process.env.REACT_APP_STAGE === "staging") {
  config = stage;
} else if (process.env.REACT_APP_STAGE === "weallride") {
  config = weallride;
} else {
  config = dev;
}

export default {
  ...config,
};
