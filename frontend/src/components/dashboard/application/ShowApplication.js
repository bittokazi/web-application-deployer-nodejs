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
      application: [],
      messages: [],
    };
  }
  componentDidMount() {}

  authSuccess() {
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
              <h4 class="page-title">Application List</h4>
              <DashboardBreadcrumb />
            </div>
          </div>
          <div class="row">
            <div class="col-md-12">
              <div class="white-box">
                <button onClick={() => this.deploy()}>Deploy</button>
                {/* <div class="table-responsive"> */}
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
                  {/* </div> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </AuthComponent>
    );
  }
}
