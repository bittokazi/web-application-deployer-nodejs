export const AuthStore = () => {
  return {
    saveClientCredentials: s => {
      localStorage.setItem("Oauth2ClientCredentials", JSON.stringify(s));
    },
    saveOauthToken: s => {
      localStorage.setItem("Oauth2TokenObject", JSON.stringify(s));
    },
    getClientCredentials: () => {
      return JSON.parse(localStorage.getItem("Oauth2ClientCredentials"));
    },
    getOauthToken: () => {
      return JSON.parse(localStorage.getItem("Oauth2TokenObject"));
    },
    saveTenantKey: s => {
      localStorage.setItem("userTenant", s);
    },
    getTenantKey: s => {
      return localStorage.getItem("userTenant") == null
        ? ""
        : localStorage.getItem("userTenant");
    }
  };
};

export default AuthStore;
