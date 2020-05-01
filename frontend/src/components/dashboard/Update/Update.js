import React, { Component } from "react";
import AuthComponent from "./../AuthComponent";
import DashboardBreadcrumb from "./.././../../layouts/DashboardBreadcrumb";
import { UserInfoContext } from "./../../../providers/UserInfoProvider";
import { ApiCall } from "../../../services/NetworkLayer";

let $ = window["$"];

export default class Update extends Component {
  static contextType = UserInfoContext;

  constructor(props) {
    super(props);
    this.state = {
      application: [],
      messages: [],
    };
  }

  deploy = () => {
    ApiCall().authorized(
      {
        method: "GET",
        url: "/applications/self/deploy/app",
      },
      (response) => {},
      (error) => {
        console.log(error.response);
      }
    );
    alert("Self Deployed... now wait and pray :s");
  };

  authSuccess(user) {
    this.context.chat.setOnMessageReceive(this.onNewMessageReceived);
  }

  componentWillUnmount() {
    this.context.chat.setOnMessageReceive(null);
  }

  onNewMessageReceived = (message) => {
    console.log(message);

    this.setState({
      messages: [...this.state.messages, message],
    });
    $("#messageList").animate(
      { scrollTop: $("#messageList").prop("scrollHeight") },
      1
    );
  };

  render() {
    return (
      <UserInfoContext.Consumer>
        {(userContextConsumer) => (
          <AuthComponent authSuccess={(user) => this.authSuccess(user)}>
            <div class="container-fluid">
              <div class="row bg-title">
                <div class="col-lg-12">
                  <h4 class="page-title">Dashboard</h4>
                  <DashboardBreadcrumb />
                </div>
              </div>
              <div class="row">
                <div class="col-md-12">
                  <div class="white-box">
                    <button onClick={() => this.deploy()}>
                      Self Update and Deploy
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
        )}
      </UserInfoContext.Consumer>
    );
  }
}
