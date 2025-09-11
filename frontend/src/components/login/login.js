import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { ApiCall } from "./../../services/NetworkLayer";
import AuthStore from "./../../services/AuthStore";
import querystring from "querystring";
import ClipLoader from "react-spinners/ClipLoader";
import "./login.css";
import config from "../../config";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loggedInCheck, setLoggedInCheck] = useState(true);
  let [loading, setLoading] = useState(false);
  let [color, setColor] = useState("#fa7035");
  let useHistoryRouter = useHistory();
  const [changePassword, setChangePassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    document.title = "Deploy Automation platform by Bitto Kazi";
    authCheck();
  }, []);

  const authCheck = () => {
    if (AuthStore().getOauthToken() != null) {
      ApiCall().authorized(
        {
          method: "GET",
          url: "/api/users/whoami",
        },
        (resolve) => {
          if (resolve.status == 200) {
            if (resolve.data.changePassword) {
              setTimeout(() => {
                setLoggedInCheck(false);
                setChangePassword(true);
              }, 1000);
            } else {
              setTimeout(() => {
                useHistoryRouter.push("/dashboard");
              }, 1000);
            }
          }
        },
        (reject) => {
          setTimeout(() => {
            if (reject.response.status == 403) {
              setErrorMessage("Permission denied: 403");
            }
            setLoggedInCheck(false);
          }, 1000);
        }
      );
    } else {
      setTimeout(() => {
        setLoggedInCheck(false);
      }, 1000);
    }
  };

  const loginUser = (event) => {
    event.preventDefault();
    setLoading(true);
    setErrorMessage("");
    if (!changePassword) {
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
              useHistoryRouter.push("/dashboard/applications");
            })
            .catch((err) => {
              setErrorMessage(err.response.data.message);
            });
        })
        .catch((err) => {
          setErrorMessage(err.response.data.message);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      ApiCall().authorized(
        {
          method: "PUT",
          url: "/api/users/change-password",
          data: {
            password,
          },
        },
        (resolve) => {
          if (resolve.status == 200) {
            setTimeout(() => {
              useHistoryRouter.push("/dashboard");
            }, 1000);
          }
        },
        (reject) => {
          console.log(reject.response);
          if (reject.response.status == 400) {
            setErrorMessage(reject.response.data.message);
            setLoading(false);
            return;
          }
        }
      );
    }
  };

  const loginSSO = (event) => {
    event.preventDefault();
    setLoading(true);
    window.location.href = window.location.href + "api/login/sso";
  };

  return (
    <>
      <div class="bg-animated"></div>
      <form class="login-form-wrapper" onSubmit={loginUser}>
        <div class="login">
          <div class="login-screen">
            <div class="app-title">
              <h1>Login</h1>
            </div>
            {loggedInCheck && (
              <div class="loading-bar">
                <ClipLoader color={color} loading={true} size={70} />
              </div>
            )}

            {!loggedInCheck && !changePassword && config.SSO_LOGIN && (
              <div class="login-form">
                {errorMessage != "" && (
                  <div style={{ color: "red" }}>{errorMessage}</div>
                )}
                <button
                  class="btn btn-primary btn-large btn-block"
                  disabled={loading}
                  onClick={loginSSO}
                >
                  Login with SSO
                </button>
                {/* <a class="login-link" href="#">Lost your password?</a> */}
              </div>
            )}

            {!loggedInCheck && !changePassword && !config.SSO_LOGIN && (
              <div class="login-form">
                <div class="control-group">
                  <input
                    type="text"
                    class="login-field"
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
                {errorMessage != "" && (
                  <div style={{ color: "red" }}>{errorMessage}</div>
                )}
                <button
                  class="btn btn-primary btn-large btn-block"
                  disabled={loading}
                >
                  login
                </button>
                {/* <a class="login-link" href="#">Lost your password?</a> */}
              </div>
            )}

            {!loggedInCheck && changePassword && !config.SSO_LOGIN && (
              <div class="login-form">
                <div class="control-group">
                  <input
                    type="password"
                    class="login-field"
                    placeholder="Set new password"
                    id="login-pass"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                  />
                  <label
                    class="login-field-icon fui-lock"
                    for="login-pass"
                  ></label>
                </div>
                {errorMessage != "" && (
                  <div style={{ color: "red" }}>{errorMessage}</div>
                )}
                <button
                  class="btn btn-primary btn-large btn-block"
                  disabled={loading}
                >
                  Change Password
                </button>
                {/* <a class="login-link" href="#">Lost your password?</a> */}
              </div>
            )}
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
