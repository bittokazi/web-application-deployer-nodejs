import * as db from "../models";
import fs from "fs";
import { Config } from "./../config/Config";
import crypto from "crypto";
import { sendNotification } from "./FirebaseService";
import { dockerCheckBuildStatus } from "./DockerHubService";
import { Octokit } from "@octokit/core";
const { spawn } = require("child_process");

export const createApplication = (body, success, error) => {
  checkAppName(
    body,
    (result) => {
      if (result) {
        error("Application name exists", 400);
      } else {
        ensureExists(
          Config()._APPLICATION_FOLDER + "/" + body.name,
          function (err) {
            if (err) {
            } else {
              fs.writeFile(
                Config()._APPLICATION_FOLDER +
                  "/" +
                  body.name +
                  "/" +
                  body.name +
                  ".sh",
                body.script,
                function (err) {
                  if (err) return console.log(err);
                  fs.writeFile(
                    Config()._APPLICATION_FOLDER + "/" + body.name + "/.env",
                    body.environments,
                    function (err) {
                      if (err) return console.log(err);
                      body.script =
                        Config()._APPLICATION_FOLDER +
                        "/" +
                        body.name +
                        "/" +
                        body.name +
                        ".sh";
                      body.location =
                        Config()._APPLICATION_FOLDER + "/" + body.name;
                      body.environments =
                        Config()._APPLICATION_FOLDER +
                        "/" +
                        body.name +
                        "/.env";
                      body.isDeploying = false;
                      db.application
                        .create(body)
                        .then((result) => {
                          success({ success: true });
                        })
                        .catch((err) => {
                          error(err);
                        });
                    }
                  );
                }
              );
            }
          }
        );
      }
    },
    (err) => {
      error(err);
    }
  );
};

export const getAllApplication = (success, error) => {
  db.application
    .findAll({
      order: [["id", "DESC"]],
    })
    .then((result) => {
      success(result);
    })
    .catch((err) => {
      error(err);
    });
};

export const updateApplication = (body, id, success, error) => {
  fs.writeFile(
    Config()._APPLICATION_FOLDER + "/" + body.name + "/" + body.name + ".sh",
    body.script,
    function (err) {
      if (err) return console.log(err);
      fs.writeFile(
        Config()._APPLICATION_FOLDER + "/" + body.name + "/.env",
        body.environments,
        function (err) {
          if (err) return console.log(err);
          body.script =
            Config()._APPLICATION_FOLDER +
            "/" +
            body.name +
            "/" +
            body.name +
            ".sh";
          body.location = Config()._APPLICATION_FOLDER + "/" + body.name;
          body.environments =
            Config()._APPLICATION_FOLDER + "/" + body.name + "/.env";
          body.isDeploying = false;
          db.application
            .update(body, {
              where: {
                id,
              },
            })
            .then((result) => {
              success(result);
            })
            .catch((err) => {
              error(err);
            });
        }
      );
    }
  );
};

export const showApplication = (id, success, error) => {
  db.application
    .findAll({
      where: {
        id: id,
      },
      order: [["id", "DESC"]],
    })
    .then((result) => {
      if (result.length == 0) {
        error({ message: "not exist" });
        return;
      }

      fs.readFile(result[0].script, "utf8", function (err, data) {
        if (err) {
          error(err);
          return console.log(err);
        }
        fs.readFile(result[0].environments, "utf8", function (_err, _data) {
          if (_err) {
            error(err);
            return console.log(_err);
          }
          success({
            id: result[0].id,
            name: result[0].name,
            branch: result[0].branch,
            secret: result[0].secret,
            script: data,
            env: _data,
            isDeploying: result[0].isDeploying,
            healthUrl: result[0].healthUrl,
            startCommand: result[0].startCommand,
            stopCommand: result[0].stopCommand,
            gitRepoLink: result[0].gitRepoLink,
            clone: result[0].clone,
          });
        });
      });
    })
    .catch((err) => {
      error(err);
    });
};

export const checkAppName = (payload, success, error) => {
  db.application
    .findAll({
      where: { name: payload.name },
      attributes: ["id"],
      include: [{ all: true }],
      order: [["id", "DESC"]],
    })
    .then((result) => {
      if (result.length > 0) success(true);
      else success(false);
    })
    .catch((err) => {
      error(err);
    });
};

export const startApplication = async (
  req,
  payload,
  id,
  success,
  error,
  args = null
) => {
  db.application
    .findAll({
      where: {
        id: id,
      },
      order: [["id", "DESC"]],
    })
    .then((result) => {
      if (result.length == 0) {
        error({ message: "not exist" });
        return;
      }
      if (result[0].isDeploying) {
        error({ message: "Another Deployment on progress" });
        return;
      }

      _startApplication(req, payload, id, success, error, args, result);
    });
};

const _startApplication = async (
  req,
  payload,
  id,
  success,
  error,
  args = null,
  result
) => {
  let githubDeploymentObject = null;
  let fullName = "";
  if (
    Config()._GITHUB_TOKEN &&
    Config()._GITHUB_TOKEN != "" &&
    result[0].gitRepoLink.includes("github.com")
  ) {
    try {
      const octokit = new Octokit({ auth: Config()._GITHUB_TOKEN });
      const explode = result[0].gitRepoLink.split("/");
      fullName =
        explode[explode.length - 2] +
        "/" +
        explode[explode.length - 1].replace(".git", "");
      githubDeploymentObject = await octokit.request(
        `POST /repos/${fullName}/deployments`,
        {
          ref: result[0].branch,
          environment: result[0].name.toLowerCase(),
        }
      );
      console.log(`GITHUB API REQUEST -> POST /repos/${fullName}/deployments`);
    } catch (error) {}
  }

  // __startApplication(
  //   req,
  //   payload,
  //   id,
  //   success,
  //   error,
  //   args,
  //   fullName,
  //   githubDeploymentObject
  // );

  deployApplication(
    req,
    payload,
    id,
    success,
    error,
    args,
    result[0].gitRepoLink.includes("github.com") ? "github" : "gitlab",
    githubDeploymentObject
  );
};

export const __startApplication = (
  req,
  payload,
  id,
  success,
  error,
  args = null,
  fullName = "",
  deploymentPayload = null
) => {
  db.application
    .findAll({
      where: {
        id: id,
      },
      order: [["id", "DESC"]],
    })
    .then((result) => {
      if (result.length == 0) {
        error({ message: "not exist" });
        return;
      }
      if (result[0].isDeploying) {
        error({ message: "Another Deployment on progress" });
        return;
      }
      db.application
        .update(
          { isDeploying: true },
          {
            where: {
              id: result[0].id,
            },
          }
        )
        .then((__result) => {
          req.socketIo.emit("chat.message.deploy", {
            message: "Initiated Deployment for " + result[0].name,
            name: result[0].name,
            type: "deployment-start",
          });

          sendNotification(
            "Deployment Started",
            result[0].name + " deployment started",
            "https://prisminfosys.com/images/deployment.png",
            ""
          );

          let bash = spawn(
            "cd " +
              result[0].location +
              " && bash " +
              result[0].script +
              (args ? " " + args : ""),
            [],
            { shell: true }
          );
          bash.stdout.on("data", function (data) {
            req.socketIo.emit("chat.message.deploy", {
              message: "log> " + data.toString(),
              name: result[0].name,
              type: "deployment-log",
            });
          });
          bash.stderr.on("data", function (data) {
            req.socketIo.emit("chat.message.deploy", {
              message: "Error> " + data.toString(),
              name: result[0].name,
              type: "deployment-err",
            });
          });
          bash.on("exit", function (data) {
            db.application
              .update(
                { isDeploying: false },
                {
                  where: {
                    id: result[0].id,
                  },
                }
              )
              .then((_result) => {});
            let deploymentStatus = "error";
            if (data.toString() == "0") {
              deploymentStatus = "success";
            }
            db.deployment
              .create({
                name: result[0].name,
                status: deploymentStatus,
              })
              .then((deployment) => {
                if (data.toString() == "0") {
                  if (
                    Config()._GITHUB_TOKEN &&
                    Config()._GITHUB_TOKEN != "" &&
                    deploymentPayload
                  ) {
                    const octokit = new Octokit({
                      auth: Config()._GITHUB_TOKEN,
                    });
                    octokit.request(
                      `POST /repos/${fullName}/deployments/${deploymentPayload.data.id}/statuses`,
                      {
                        state: "success",
                        auto_inactive: true,
                      }
                    );
                  }
                  sendNotification(
                    "Deployment Success",
                    result[0].name + " deployment successful",
                    "https://prisminfosys.com/images/deployment.png",
                    ""
                  );
                  req.socketIo.emit("chat.message.deploy", {
                    message:
                      "Deploy>>>>>>>>>>>>" +
                      result[0].name +
                      "<<<<<<<<<<<<SUCCESS",
                    name: result[0].name,
                    type: "deployment-success",
                  });
                } else {
                  if (
                    Config()._GITHUB_TOKEN &&
                    Config()._GITHUB_TOKEN != "" &&
                    deploymentPayload
                  ) {
                    const octokit = new Octokit({
                      auth: Config()._GITHUB_TOKEN,
                    });
                    octokit.request(
                      `POST /repos/${fullName}/deployments/${deploymentPayload.data.id}/statuses`,
                      {
                        state: "failure",
                        auto_inactive: true,
                      }
                    );
                  }
                  sendNotification(
                    "Deployment Failed",
                    result[0].name + " deployment failed",
                    "https://prisminfosys.com/images/deployment.png",
                    ""
                  );
                  req.socketIo.emit("chat.message.deploy", {
                    message:
                      "Deploy>>>>>>>>>>>>" +
                      result[0].name +
                      "<<<<<<<<<<<<Failed",
                    name: result[0].name,
                    type: "deployment-success",
                  });
                }
                req.socketIo.emit("chat.message.deploy", {
                  message: "Exit: " + data.toString(),
                  name: result[0].name,
                  type: "deployment-exit",
                });
              });
          });
          success(result);
        })
        .catch((err) => {
          error(err);
        });
    })
    .catch((err) => {
      error(err);
    });
};

export const stopApplication = (
  req,
  payload,
  id,
  success,
  error,
  args = null
) => {
  db.application
    .findAll({
      where: {
        id: id,
      },
      order: [["id", "DESC"]],
    })
    .then((result) => {
      if (result.length == 0) {
        error({ message: "not exist" });
        return;
      }
      if (result[0].isDeploying) {
        error({ message: "Another Deployment on progress" });
        return;
      }
      db.application
        .update(
          { isDeploying: true },
          {
            where: {
              id: result[0].id,
            },
          }
        )
        .then((__result) => {
          req.socketIo.emit("chat.message.deploy", {
            message: "Initiated Shutdown for " + result[0].name,
            name: result[0].name,
            type: "deployment-start",
          });

          sendNotification(
            "Shutdown Started",
            result[0].name + " Shutdown started",
            "https://prisminfosys.com/images/deployment.png",
            ""
          );

          let bash = spawn(
            "cd " + result[0].location + " && " + result[0].stopCommand,
            [],
            { shell: true }
          );
          bash.stdout.on("data", function (data) {
            req.socketIo.emit("chat.message.deploy", {
              message: "log> " + data.toString(),
              name: result[0].name,
              type: "deployment-log",
            });
          });
          bash.stderr.on("data", function (data) {
            req.socketIo.emit("chat.message.deploy", {
              message: "Error> " + data.toString(),
              name: result[0].name,
              type: "deployment-err",
            });
          });
          bash.on("exit", function (data) {
            db.application
              .update(
                { isDeploying: false },
                {
                  where: {
                    id: result[0].id,
                  },
                }
              )
              .then((_result) => {});
            let deploymentStatus = "error";
            if (data.toString() == "0") {
              deploymentStatus = "success";
            }
            db.deployment
              .create({
                name: result[0].name,
                status: deploymentStatus,
              })
              .then((deployment) => {
                if (data.toString() == "0") {
                  sendNotification(
                    "Shutdown Success",
                    result[0].name + " Shutdown successful",
                    "https://prisminfosys.com/images/deployment.png",
                    ""
                  );
                  req.socketIo.emit("chat.message.deploy", {
                    message:
                      "Shutdown>>>>>>>>>>>>" +
                      result[0].name +
                      "<<<<<<<<<<<<SUCCESS",
                    name: result[0].name,
                    type: "deployment-success",
                  });
                } else {
                  sendNotification(
                    "Shutdown Failed",
                    result[0].name + " Shutdown failed",
                    "https://prisminfosys.com/images/deployment.png",
                    ""
                  );
                  req.socketIo.emit("chat.message.deploy", {
                    message:
                      "Shutdown>>>>>>>>>>>>" +
                      result[0].name +
                      "<<<<<<<<<<<<Failed",
                    name: result[0].name,
                    type: "deployment-success",
                  });
                }
                req.socketIo.emit("chat.message.deploy", {
                  message: "Exit: " + data.toString(),
                  name: result[0].name,
                  type: "deployment-exit",
                });
              });
          });
          success(result);
        })
        .catch((err) => {
          error(err);
        });
    })
    .catch((err) => {
      error(err);
    });
};

export const deployApplication = (
  req,
  payload,
  id,
  success,
  error,
  args = null,
  deployedFrom = "github",
  deploymentPayload = null
) => {
  db.application
    .findAll({
      where: {
        id: id,
      },
      order: [["id", "DESC"]],
    })
    .then((result) => {
      if (result.length == 0) {
        error({ message: "not exist" });
        return;
      }
      if (result[0].isDeploying) {
        error({ message: "Another Deployment on progress" });
        return;
      }
      db.application
        .update(
          { isDeploying: true },
          {
            where: {
              id: result[0].id,
            },
          }
        )
        .then((__result) => {
          createLogFile(
            result[0].name,
            "Initiated Deployment for " + result[0].name
          );
          req.socketIo.emit("chat.message.deploy", {
            message: "Initiated Deployment for " + result[0].name,
            name: result[0].name,
            type: "deployment-start",
          });

          sendNotification(
            "Deployment Started",
            result[0].name + " deployment started",
            "https://prisminfosys.com/images/deployment.png",
            ""
          );

          let bash = spawn(
            "cd " +
              result[0].location +
              " && bash " +
              result[0].script +
              (args ? " " + args : ""),
            [],
            { shell: true }
          );
          bash.stdout.on("data", function (data) {
            appendLogFile(result[0].name, "log> " + data.toString());
            req.socketIo.emit("chat.message.deploy", {
              message: "log> " + data.toString(),
              name: result[0].name,
              type: "deployment-log",
            });
          });
          bash.stderr.on("data", function (data) {
            appendLogFile(result[0].name, "Error> " + data.toString());
            req.socketIo.emit("chat.message.deploy", {
              message: "Error> " + data.toString(),
              name: result[0].name,
              type: "deployment-err",
            });
          });
          bash.on("exit", function (data) {
            db.application
              .update(
                { isDeploying: false },
                {
                  where: {
                    id: result[0].id,
                  },
                }
              )
              .then((_result) => {});
            let deploymentStatus = "error";
            if (data.toString() == "0") {
              deploymentStatus = "success";
            }
            db.deployment
              .create({
                name: result[0].name,
                status: deploymentStatus,
              })
              .then((deployment) => {
                if (data.toString() == "0") {
                  if (
                    Config()._GITHUB_TOKEN &&
                    Config()._GITHUB_TOKEN != "" &&
                    deployedFrom == "github"
                  ) {
                    const octokit = new Octokit({
                      auth: Config()._GITHUB_TOKEN,
                    });
                    octokit.request(
                      `POST /repos/${payload.repository.full_name}/deployments/${deploymentPayload.data.id}/statuses`,
                      {
                        state: "success",
                        auto_inactive: true,
                      }
                    );
                  }

                  appendLogFile(
                    result[0].name,
                    "Deploy>>>>>>>>>>>>" +
                      result[0].name +
                      "<<<<<<<<<<<<SUCCESS"
                  );

                  sendNotification(
                    "Deployment Success",
                    result[0].name + " deployment successful",
                    "https://prisminfosys.com/images/deployment.png",
                    ""
                  );
                  req.socketIo.emit("chat.message.deploy", {
                    message:
                      "Deploy>>>>>>>>>>>>" +
                      result[0].name +
                      "<<<<<<<<<<<<SUCCESS",
                    name: result[0].name,
                    type: "deployment-success",
                  });
                } else {
                  if (
                    Config()._GITHUB_TOKEN &&
                    Config()._GITHUB_TOKEN != "" &&
                    deployedFrom == "github"
                  ) {
                    const octokit = new Octokit({
                      auth: Config()._GITHUB_TOKEN,
                    });
                    octokit.request(
                      `POST /repos/${payload.repository.full_name}/deployments/${deploymentPayload.data.id}/statuses`,
                      {
                        state: "failure",
                        auto_inactive: true,
                      }
                    );
                  }

                  sendNotification(
                    "Deployment Failed",
                    result[0].name + " deployment failed",
                    "https://prisminfosys.com/images/deployment.png",
                    ""
                  );
                  appendLogFile(
                    result[0].name,
                    "Deploy>>>>>>>>>>>>" + result[0].name + "<<<<<<<<<<<<Failed"
                  );
                  req.socketIo.emit("chat.message.deploy", {
                    message:
                      "Deploy>>>>>>>>>>>>" +
                      result[0].name +
                      "<<<<<<<<<<<<Failed",
                    name: result[0].name,
                    type: "deployment-success",
                  });
                }
                appendLogFile(result[0].name, "Exit: " + data.toString());
                req.socketIo.emit("chat.message.deploy", {
                  message: "Exit: " + data.toString(),
                  name: result[0].name,
                  type: "deployment-exit",
                });
              });
          });
          success(result);
        })
        .catch((err) => {
          error(err);
        });
    })
    .catch((err) => {
      error(err);
    });
};

export const githubDeployApplication = (req, success, error) => {
  if (req.param("id") && JSON.stringify(req.body)) {
    db.application
      .findAll({
        where: {
          name: req.param("id"),
        },
        order: [["id", "DESC"]],
      })
      .then((result) => {
        if (result.length == 0) {
          error({ message: "not exist" });
          return;
        }
        if (
          req.header("x-hub-signature") &&
          req.header("x-hub-signature") != "null" &&
          req.header("x-hub-signature") != ""
        ) {
          const signature = `sha1=${crypto
            .createHmac("sha1", result[0].secret)
            .update(JSON.stringify(req.body))
            .digest("hex")}`;
          if (req.headers["x-hub-signature"] === signature) {
            if (req.body.ref === "refs/heads/" + result[0].branch) {
              sendNotification(
                "Github auto Deployment",
                result[0].name + " github auto deployment started",
                "https://prisminfosys.com/images/deployment.png",
                ""
              );
              if (result[0].clone) {
                let command =
                  "git clone https://" + Config()._GITHUB_USERNAME + ":";
                command += Config()._GITHUB_TOKEN;
                command +=
                  "@" +
                  result[0].gitRepoLink
                    .replace("http://", "")
                    .replace("https://", "");
                let bash = spawn(command, [], { shell: true });
                bash.stdout.on("data", function (data) {
                  appendLogFile(result[0].name, "log> " + data.toString());
                  req.socketIo.emit("chat.message.deploy", {
                    message: "log> " + data.toString(),
                    name: result[0].name,
                    type: "deployment-log",
                  });
                });
                bash.stderr.on("data", function (data) {
                  appendLogFile(result[0].name, "Error> " + data.toString());
                  req.socketIo.emit("chat.message.deploy", {
                    message: "Error> " + data.toString(),
                    name: result[0].name,
                    type: "deployment-err",
                  });
                });
                bash.on("exit", function (data) {
                  createGithubDeployment(
                    req,
                    req.body,
                    result[0],
                    success,
                    error
                  );
                });
              } else {
                createGithubDeployment(
                  req,
                  req.body,
                  result[0],
                  success,
                  error
                );
              }
            } else error(err);
          } else error(err);
        } else error(err);
      })
      .catch((err) => {
        error(err);
      });
  }
};

export const gitlabDeployApplication = (req, success, error) => {
  if (req.param("id") && JSON.stringify(req.body)) {
    db.application
      .findAll({
        where: {
          name: req.param("id"),
        },
        order: [["id", "DESC"]],
      })
      .then((result) => {
        if (result.length == 0) {
          error({ message: "not exist" });
          return;
        }
        if (
          req.header("X-Gitlab-Token") &&
          req.header("X-Gitlab-Token") != "null" &&
          req.header("X-Gitlab-Token") != ""
        ) {
          if (req.headers["X-Gitlab-Token"] === result[0].secret) {
            if (req.body.ref === "refs/heads/" + result[0].branch) {
              sendNotification(
                "Gitlab auto Deployment",
                result[0].name + " gitlab auto deployment started",
                "https://prisminfosys.com/images/deployment.png",
                ""
              );
              if (result[0].clone) {
                let command = "git clone https://gitlab-ci-token:";
                command += Config()._GITLAB_TOKEN;
                command +=
                  "@" +
                  result[0].gitRepoLink
                    .replace("http://", "")
                    .replace("https://", "");
                let bash = spawn(command, [], { shell: true });
                bash.stdout.on("data", function (data) {
                  appendLogFile(result[0].name, "log> " + data.toString());
                  req.socketIo.emit("chat.message.deploy", {
                    message: "log> " + data.toString(),
                    name: result[0].name,
                    type: "deployment-log",
                  });
                });
                bash.stderr.on("data", function (data) {
                  appendLogFile(result[0].name, "Error> " + data.toString());
                  req.socketIo.emit("chat.message.deploy", {
                    message: "Error> " + data.toString(),
                    name: result[0].name,
                    type: "deployment-err",
                  });
                });
                bash.on("exit", function (data) {
                  createGithubDeployment(
                    req,
                    req.body,
                    result[0],
                    success,
                    error,
                    null,
                    "gitlab"
                  );
                });
              } else {
                createGithubDeployment(
                  req,
                  req.body,
                  result[0],
                  success,
                  error,
                  null,
                  "gitlab"
                );
              }
            } else error(err);
          } else error(err);
        } else error(err);
      })
      .catch((err) => {
        error(err);
      });
  }
};

const createGithubDeployment = async (
  req,
  payload,
  result,
  success,
  error,
  args = null,
  deployedFrom = "github"
) => {
  let githubDeploymentObject = null;
  if (
    Config()._GITHUB_TOKEN &&
    Config()._GITHUB_TOKEN != "" &&
    deployedFrom == "github"
  ) {
    try {
      const octokit = new Octokit({ auth: Config()._GITHUB_TOKEN });
      githubDeploymentObject = await octokit.request(
        `POST /repos/${payload.repository.full_name}/deployments`,
        {
          ref: payload.after,
          environment: result.name.toLowerCase(),
        }
      );
    } catch (error) {}
  }
  deployApplication(
    req,
    payload,
    result.id,
    success,
    error,
    args,
    deployedFrom,
    githubDeploymentObject
  );
};

export const dockerDeployApplication = (req, success, error) => {
  if (req.param("id")) {
    db.application
      .findAll({
        where: {
          name: req.param("id"),
        },
        order: [["id", "DESC"]],
      })
      .then((result) => {
        if (result.length == 0) {
          error({ message: "not exist" });
          return;
        }
        if (
          req.param("secret") &&
          req.param("secret") == result[0].secret &&
          req.body.push_data.tag != "latest"
        ) {
          sendNotification(
            "Docker auto Deployment",
            result[0].name + " docker auto deployment started",
            "https://prisminfosys.com/images/deployment.png",
            ""
          );
          req.socketIo.emit("chat.message.deploy", {
            message:
              "log> " +
              req.body.callback_url +
              " - Tag - " +
              req.body.push_data.tag,
            name: result[0].name,
            type: "deployment-log",
          });
          deployApplication(
            req,
            req.body,
            result[0].id,
            success,
            error,
            req.body.push_data.tag,
            "docker",
            null
          );
          dockerCheckBuildStatus(req.body.callback_url);
        } else error(err);
      })
      .catch((err) => {
        error(err);
      });
  }
};

export const selfDeployerService = (req, success, error) => {
  console.log("self deploy...");
  sendNotification(
    "System Update",
    "System update Started",
    "https://prisminfosys.com/images/deployment.png",
    ""
  ).finally(() => {
    let bash = spawn(
      "cp " +
        __dirname +
        "/../../scripts/" +
        Config()._SELF_DEPLOY_SCRIPT +
        ".sh " +
        __dirname +
        "/../../../self_deploy.sh && cp " +
        __dirname +
        "/../../.env " +
        __dirname +
        "/../../../.env && cp " +
        __dirname +
        "/../../scripts/self_deploy.js " +
        __dirname +
        "/../../../self_deploy.js && cd ../ && node self_deploy.js",
      [],
      { shell: true }
    );
    bash.on("exit", function (data) {
      console.log("exit", data.toString());
      req.socketIo.emit("chat.message.deploy", {
        message: "exit: " + data.toString(),
        name: "deployer",
        type: "self-deployment",
      });
    });
    bash.stderr.on("data", function (data) {
      console.log("stderr", data.toString());
      req.socketIo.emit("chat.message.deploy", {
        message: "err> " + data.toString(),
        name: "deployer",
        type: "self-deployment",
      });
    });
    bash.stdout.on("data", function (data) {
      console.log("stdout", data.toString());
      req.socketIo.emit("chat.message.deploy", {
        message: "log> " + data.toString(),
        name: "deployer",
        type: "self-deployment",
      });
    });
    success({});
  });
};

function ensureExists(path, cb) {
  fs.mkdir(path, function (err) {
    if (err) {
      if (err.code == "EXIST") cb(null);
      // ignore the error if the folder already exists
      else cb(err); // something else went wrong
    } else cb(null); // successfully created folder
  });
}

function createLogFile(appFolder, data) {
  fs.writeFile(
    Config()._APPLICATION_FOLDER + "/" + appFolder + "/log.txt",
    data,
    function (err) {
      if (err) return console.log(err);
    }
  );
}

function appendLogFile(appFolder, data) {
  fs.appendFile(
    Config()._APPLICATION_FOLDER + "/" + appFolder + "/log.txt",
    data,
    function (err) {
      if (err) return console.log(err);
    }
  );
}

export const getLogFile = (id, success, error) => {
  db.application
    .findAll({
      where: {
        id: id,
      },
      order: [["id", "DESC"]],
    })
    .then((result) => {
      if (result.length == 0) {
        error({ message: "not exist" });
        return;
      }

      fs.readFile(
        Config()._APPLICATION_FOLDER + "/" + result[0].name + "/log.txt",
        "utf8",
        function (err, data) {
          if (err) {
            error(err);
            return console.log(err);
          }
          success({ data });
        }
      );
    });
};
