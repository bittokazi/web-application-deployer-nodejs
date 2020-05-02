import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { ApiCall } from "./../../services/NetworkLayer";
import AuthStore from "./../../services/AuthStore";
import querystring from "querystring";
import { Link } from "react-router-dom";
import config from "./../../config";
import "./login.css";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  let useHistoryRouter = useHistory();

  useEffect(() => {
    document.title = "Deploy Automation platform by Bitto Kazi";
    authCheck();
  }, []);

  const authCheck = () => {
    if (AuthStore().getOauthToken() != null) {
      ApiCall().authorized(
        {
          method: "GET",
          url: "/users/whoami",
        },
        (resolve) => {
          if (resolve.status >= 200) {
            useHistoryRouter.push("/dashboard");
          }
        },
        (reject) => {}
      );
    }
  };

  const loginUser = (event) => {
    event.preventDefault();
    ApiCall()
      .public()
      .post("/api/login", {
        username,
        password,
      })
      .then((res) => {
        AuthStore().saveClientCredentials(res.data);
        ApiCall()
          .token()
          .post(
            "/oauth/token",
            querystring.stringify({
              username,
              password,
              grant_type: "password",
            })
          )
          .then((res) => {
            AuthStore().saveOauthToken(res.data);
            useHistoryRouter.push("/dashboard");
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      <form class="login-form-wrapper" onSubmit={loginUser}>
        <div class="login">
          <div class="login-screen">
            <div class="app-title">
              <h1>Login</h1>
            </div>

            <div class="login-form">
              <div class="control-group">
                <input
                  type="text"
                  class="login-field"
                  value=""
                  placeholder="username"
                  id="login-name"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                />
                <label
                  class="login-field-icon fui-user"
                  for="login-name"
                ></label>
              </div>

              <div class="control-group">
                <input
                  type="password"
                  class="login-field"
                  value=""
                  placeholder="password"
                  id="login-pass"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
                <label
                  class="login-field-icon fui-lock"
                  for="login-pass"
                ></label>
              </div>

              <button class="btn btn-primary btn-large btn-block">login</button>
              {/* <a class="login-link" href="#">Lost your password?</a> */}
            </div>
          </div>
        </div>

        {/* <span class="login100-form-title p-b-26">
                  Application Deployer
                </span>
                <span class="login100-form-title p-b-48">
                  <i class="zmdi zmdi-font"></i>
                </span>

                <div
                  class="wrap-input100 validate-input"
                  data-validate="Valid email is: a@b.c"
                >
                  <input
                    class="input100"
                    type="text"
                    name="email"
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                  />
                  <span class="focus-input100" data-placeholder="Email"></span>
                </div>

                <div
                  class="wrap-input100 validate-input"
                  data-validate="Enter password"
                >
                  <span class="btn-show-pass">
                    <i class="zmdi zmdi-eye"></i>
                  </span>
                  <input
                    class="input100"
                    type="password"
                    name="pass"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                  />
                  <span
                    class="focus-input100"
                    data-placeholder="Password"
                  ></span>
                </div>

                <div class="container-login100-form-btn">
                  <div class="wrap-login100-form-btn">
                    <div class="login100-form-bgbtn"></div>
                    <button class="login100-form-btn">Login</button>
                  </div>
                </div> */}
      </form>
    </>
  );
}
