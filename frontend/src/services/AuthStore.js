import config from "../config";

export const AuthStore = () => {
  return {
    saveClientCredentials: (s) => {
      localStorage.setItem("Oauth2ClientCredentials", JSON.stringify(s));
    },
    saveOauthToken: (s) => {
      localStorage.setItem("Oauth2TokenObject", JSON.stringify(s));
    },
    getClientCredentials: () => {
      return JSON.parse(localStorage.getItem("Oauth2ClientCredentials"));
    },
    getOauthToken: () => {
      if (config.SSO_LOGIN) {
        let obj = {};
        if (getCookie("access_token") && getCookie("refresh_token")) {
          obj["access_token"] = getCookie("access_token");
          obj["refresh_token"] = getCookie("refresh_token");
          return obj;
        }
        return null;
      }
      return JSON.parse(localStorage.getItem("Oauth2TokenObject"));
    },
    saveTenantKey: (s) => {
      localStorage.setItem("userTenant", s);
    },
    getTenantKey: (s) => {
      return localStorage.getItem("userTenant") == null
        ? ""
        : localStorage.getItem("userTenant");
    },
  };
};

function getCookie(name) {
  function escape(s) {
    return s.replace(/([.*+?\^$(){}|\[\]\/\\])/g, "\\$1");
  }
  var match = document.cookie.match(
    RegExp("(?:^|;\\s*)" + escape(name) + "=([^;]*)")
  );
  return match ? match[1] : null;
}

export default AuthStore;
