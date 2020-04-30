import React, { Component } from "react";
import AuthComponent from "./../AuthComponent";
import DashboardBreadcrumb from "./.././../../layouts/DashboardBreadcrumb";
import { UserInfoContext } from "./../../../providers/UserInfoProvider";
import { ApiCall } from "../../../services/NetworkLayer";

export default class MainPage extends Component {
  constructor(props) {
    super(props);
    this.state = {};
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

  authSuccess(user) {}

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
                  <div class="white-box"></div>
                  <button onClick={() => this.deploy()}>
                    XXXXSelf DeployXXXX
                  </button>
                </div>
              </div>
            </div>
          </AuthComponent>
        )}
      </UserInfoContext.Consumer>
    );
  }
}
