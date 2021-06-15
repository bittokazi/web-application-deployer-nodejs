import React, { Component } from "react";
import AuthComponent from "./../AuthComponent";
import DashboardBreadcrumb from "./.././../../layouts/DashboardBreadcrumb";
import { UserInfoContext } from "./../../../providers/UserInfoProvider";
import { ApiCall } from "../../../services/NetworkLayer";
import "./update.css";

let $ = window["$"];

export default class Update extends Component {
  static contextType = UserInfoContext;

  constructor(props) {
    super(props);
    this.state = {
      application: [],
      messages: [],
      updating: false,
      updateMessage: "Starting...",
    };
  }

  deploy = () => {
    let answer = window.confirm("Update System?");
    if (answer) {
      this.setState({
        updating: true,
      });
      $("#update-modal").css("display", "block");
      ApiCall().authorized(
        {
          method: "GET",
          url: "/applications/self/deploy/app",
        },
        (response) => {
          setInterval(() => {
            ApiCall()
              .public()
              .get("/health")
              .then((res) => {
                console.log(res);
              })
              .catch((err) => {
                console.log(err);
              });
          }, 5000);
        },
        (error) => {
          console.log(error.response);
        }
      );
    } else {
    }
  };

  authSuccess(user) {
    this.context.chat.setOnMessageReceive(this.onNewMessageReceived);
    this.context.chat.setOnDisconnect(this.onDisConnectListner);
    this.context.chat.setOnConnect(this.onConnect);
  }

  componentWillUnmount() {
    this.context.chat.setOnMessageReceive(null);
    this.context.chat.setOnDisconnect(null);
    this.context.chat.setOnConnect(null);
  }

  onConnect = () => {
    if (this.state.updating) window.location.reload();
  };

  onDisConnectListner = () => {
    if (!this.state.updating) return;
    $("#update-modal").css("display", "block");
    this.setState({
      updateMessage: "Please wait, Updating System...",
    });
  };

  onNewMessageReceived = (message) => {
    console.log(message);
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
                    <h5>Current Version: 1.1.6.rc_5</h5>
                    <br></br>
                    <button
                      class="btn btn-info waves-effect waves-light"
                      onClick={() => this.deploy()}
                    >
                      Update System
                    </button>
                  </div>
                  <div class="update-wrapper" id="update-modal">
                    <div class="update-box">
                      <div class="cssload-speeding-wheel loader"></div>
                      <h3>{this.state.updateMessage}</h3>
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
