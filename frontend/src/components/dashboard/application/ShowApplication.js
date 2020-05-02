import React, { useState, Component } from "react";
import { ApiCall } from "../../../services/NetworkLayer";
import AuthComponent from "../AuthComponent";
import DashboardBreadcrumb from "../../../layouts/DashboardBreadcrumb";
import { UserInfoContext } from "./../../../providers/UserInfoProvider";

let $ = window["$"];

export default class ShowApplication extends Component {
  static contextType = UserInfoContext;

  constructor(props) {
    super(props);

    this.state = {
      application: null,
      messages: [],
      isDeploying: true,
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
      },
      (error) => {
        console.log(error.response);
      }
    );
  }

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
        messages: [...this.state.messages, message],
      });
      $("#messageList").animate(
        { scrollTop: $("#messageList").prop("scrollHeight") },
        1
      );
    }
  };

  deploy = () => {
    ApiCall().authorized(
      {
        method: "GET",
        url: "/applications/" + this.props.match.params.id + "/deploy",
      },
      (response) => {
        this.setState({ application: response.data });
      },
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
                  onClick={() => this.deploy()}
                  disabled={this.state.isDeploying}
                >
                  Deploy Application
                </button>
                <div
                  class="row"
                  id="messageList"
                  style={{
                    background: "black",
                    color: "white",
                    height: "600px",
                    "overflow-y": "scroll",
                  }}
                >
                  {this.state.messages.map((message) => {
                    return <div class="col-md-12">{message.message}</div>;
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </AuthComponent>
    );
  }
}
