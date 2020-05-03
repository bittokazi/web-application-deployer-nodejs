import React, { useState, Component } from "react";
import { ApiCall } from "../../../services/NetworkLayer";
import AuthComponent from "../AuthComponent";
import DashboardBreadcrumb from "../../../layouts/DashboardBreadcrumb";
import { UserInfoContext } from "./../../../providers/UserInfoProvider";
import Moment from "react-moment";

let $ = window["$"];

export default class ShowApplication extends Component {
  static contextType = UserInfoContext;

  constructor(props) {
    super(props);

    this.state = {
      application: null,
      messages: [],
      isDeploying: true,
      deployments: [],
    };
  }
  componentDidMount() {}

  authSuccess() {
    this.context.chat.setOnMessageReceive(this.onNewMessageReceived);
    ApiCall().authorized(
      {
        method: "GET",
        url: "/applications/" + this.props.match.params.id,
      },
      (response) => {
        this.setState({
          application: response.data,
          isDeploying: response.data.isDeploying,
        });
        this.getAllDeployments(response.data.name);
      },
      (error) => {
        console.log(error.response);
      }
    );
  }

  getAllDeployments = (name) => {
    ApiCall().authorized(
      {
        method: "GET",
        url: "/applications/" + name + "/deployments",
      },
      (response) => {
        this.setState({
          deployments: response.data,
        });
      },
      (error) => {
        console.log(error.response);
      }
    );
  };

  componentWillUnmount() {
    this.context.chat.setOnMessageReceive(null);
  }

  onNewMessageReceived = (message) => {
    console.log(message);
    if (this.state.application.name == message.name) {
      if (message.type == "deployment-start") {
        this.setState({
          isDeploying: true,
        });
      }
      if (
        message.type == "deployment-success" ||
        message.type == "deployment-exit"
      ) {
        this.setState({
          isDeploying: false,
        });
      }
      this.setState({
        messages: [...this.state.messages, message.message],
      });
      $("#messageList").animate(
        { scrollTop: $("#messageList").prop("scrollHeight") },
        1
      );
      this.getAllDeployments(this.state.application.name);
    }
  };

  deploy = () => {
    ApiCall().authorized(
      {
        method: "GET",
        url: "/applications/" + this.props.match.params.id + "/deploy",
      },
      (response) => {},
      (error) => {
        console.log(error.response);
      }
    );
  };

  render() {
    return (
      <AuthComponent authSuccess={() => this.authSuccess()}>
        <div class="container-fluid">
          <div class="row bg-title">
            <div class="col-lg-12">
              <h4 class="page-title">Deploy Application</h4>
              <DashboardBreadcrumb />
            </div>
          </div>
          <div class="row">
            <div class="col-md-12">
              <div class="white-box">
                <button
                  class="btn btn-success waves-effect waves-light"
                  style={{ float: "left" }}
                  onClick={() => this.deploy()}
                  disabled={this.state.isDeploying}
                >
                  Deploy Application
                </button>
                {this.state.isDeploying && (
                  <div
                    style={{ float: "left", "margin-left": "14px" }}
                    class="cssload-speeding-wheel"
                  ></div>
                )}

                <br />
                <br />
                <div class="row">
                  <div class="col-md-4">
                    <div class="table-responsive">
                      <table class="table table-striped">
                        <thead>
                          <tr>
                            <th>Name</th>
                            <th>When</th>
                            <th>Tme</th>
                          </tr>
                        </thead>
                        <tbody>
                          {this.state.deployments.map((deployment) => {
                            return (
                              <tr>
                                <td>{deployment.name}</td>
                                <td>
                                  <Moment fromNow ago>
                                    {deployment.timestamp}
                                  </Moment>
                                </td>
                                <td>
                                  <Moment parse="YYYY-MM-DD HH:mm">
                                    {deployment.timestamp}
                                  </Moment>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div class="col-md-8">
                    <div
                      class="row"
                      style={{
                        background: "#3a3f51",
                        color: "white",
                        height: "597px",
                        width: "100%",
                        position: "relative",
                      }}
                    >
                      <div
                        style={{
                          position: "relative",
                          background: "#eaecf2",
                          width: "100%",
                          color: "black",
                          "font-size": "17px",
                          "font-weight": "bold",
                          padding: "15px",
                          "padding-bottom": "12px",
                          "padding-top": "13px",
                        }}
                      >
                        Logs
                      </div>
                      <div
                        id="messageList"
                        style={{
                          position: "relative",
                          top: 0,
                          left: 0,
                          height: "546px",
                          "overflow-y": "scroll",
                        }}
                      >
                        {this.state.messages.map((message) => {
                          return <div class="col-md-12">{message}</div>;
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AuthComponent>
    );
  }
}
