import axios from "axios";
import AuthStore from "./AuthStore";
import base64 from "base-64";
import utf8 from "utf8";
import querystring from "querystring";
import config from "./../config";

let baseURL = config.API_BASE_URL_PROTOCOL + config.API_BASE_URL;

const encodedToken = () => {
  try {
    const token = `${AuthStore().getClientCredentials().client_id}:${
      AuthStore().getClientCredentials().client_secret
    }`;
    const bytes = utf8.encode(token);
    const encoded = base64.encode(bytes);
    return encoded;
  } catch (e) {}
  return "";
};

export const ApiCall = () => {
  const subdomain = window.location.hostname.split(".");
  if (
    config.subdomainMode &&
    subdomain.length == config.subdomainNumber &&
    subdomain[0] != "www"
  ) {
    baseURL =
      config.API_BASE_URL_PROTOCOL + subdomain[0] + "." + config.API_BASE_URL;
  }
  return {
    public: () => {
      return axios.create({
        baseURL: baseURL,
      });
    },
    token: () => {
      return axios.create({
        baseURL: baseURL,
        headers: {
          Authorization: `Basic ${encodedToken()}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });
    },
    authorized: (call, resolve, reject) => {
      let requestConfig = null;
      let http = axios.create({
        baseURL: baseURL,
        headers: {
          Authorization: `Bearer ${AuthStore().getOauthToken().access_token}`,
        },
      });
      http.interceptors.request.use(
        function (config) {
          requestConfig = config;
          return config;
        },
        function (error) {
          return Promise.reject(error);
        }
      );
      http.interceptors.response.use(
        function (response) {
          return response;
        },
        function (error) {
          if (!error.response) {
            reject({ type: "noServer" });
          }
          if (error.response.status == 401) {
            let refreshToken = config.SSO_LOGIN
              ? axios.create({
                  baseURL: baseURL,
                })
              : axios.create({
                  baseURL: baseURL,
                  headers: {
                    Authorization: `Basic ${encodedToken()}`,
                    "Content-Type": "application/x-www-form-urlencoded",
                  },
                });
            refreshToken
              .post(
                config.SSO_LOGIN
                  ? "/api/login/oauth2/refresh/token"
                  : "/oauth/token",
                config.SSO_LOGIN
                  ? querystring.stringify({
                      refresh_token: `${
                        AuthStore().getOauthToken().refresh_token
                      }`,
                    })
                  : querystring.stringify({
                      grant_type: "refresh_token",
                      refresh_token: `${
                        AuthStore().getOauthToken().refresh_token
                      }`,
                    })
              )
              .then(function (response) {
                AuthStore().saveOauthToken(response.data);
                requestConfig.headers.Authorization = `Bearer ${response.data.access_token}`;
                axios(requestConfig)
                  .then((res) => {
                    console.log("new req", res);
                    resolve(res);
                    return;
                  })
                  .catch((err) => {
                    console.log("new req err", err);
                    reject(err);
                    return;
                  });
              })
              .catch(function (error) {
                reject(error);
                return;
              });
          } else {
            reject(error);
            return;
          }
        }
      );
      http(call)
        .then((res) => resolve(res))
        .catch((err) => {});
    },
  };
};
