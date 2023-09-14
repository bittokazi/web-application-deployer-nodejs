import Config from "../../config/Config";
import request from "request";
import base64 from "base-64";
import utf8 from "utf8";

export const SSOTokenInterceptor = (req, res, next) => {
  var token = req.header("Authorization");
  var matches = token.match(/Bearer\s(\S+)/);

  if (matches) {
    const basic = `${Config()._SSO_CLIENT_ID}:${Config()._SSO_CLIENT_SECRET}`;
    const bytes = utf8.encode(basic);
    const encoded = base64.encode(bytes);
    let formData = {
      token: matches[1],
    };
    let post_options = {
      url: Config()._SSO_DOMAIN + "/oauth2/introspect",
      method: "POST",
      json: false,
      headers: {
        Authorization: "Basic " + encoded,
      },
      formData: formData,
    };

    request.post(post_options, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        if (JSON.parse(body).active) {
          req.user_principle = JSON.parse(body).sub;
          next();
        } else {
          return res.status(401).json({ error: "Unauthorized access" });
        }
      } else {
        return res.status(401).json({ error: "Unauthorized access" });
      }
    });
  } else {
    return res.status(401).json({ error: "Unauthorized access" });
  }
};

export default SSOTokenInterceptor;
