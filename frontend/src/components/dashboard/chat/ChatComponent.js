import React, { Component } from "react";
import { UserInfoContext } from "./../../../providers/UserInfoProvider";
import { ApiCall } from "./../../../services/NetworkLayer";

let $ = window["$"];

export default class ChatComponent extends Component {
  static contextType = UserInfoContext;

  constructor(props) {
    super(props);

    this.state = {
      messages: [],
      loaded: false,
      init: false,
      componentLoaded: false,
    };
  }

  componentDidMount() {
    this.context.chat.setChatComponentConnect(this.connect);
    this.context.chat.setOnUserStatus(this.onStatus);
  }

  connect = () => {
    console.log("bbbbbbbbbbbbbbbbbbbbbbbbbb");
    this.state.init = false;
    if (
      !this.context.chat.connected &&
      this.context.chat.connectChat &&
      !this.state.loaded &&
      !this.state.componentLoaded
    ) {
      this.state.componentLoaded = true;
      ApiCall().authorized(
        {
          method: "GET",
          url: "/users/chat/token",
        },
        (resolve) => {
          this.context.chat.connect(() => {
            this.setState({
              loaded: true,
            });
          }, resolve.data.token);
        },
        (error) => {}
      );
    }
  };

  componentWillUnmount() {
    this.context.chat.disconnect();
    this.context.chat.setChatComponentConnect(null);
    this.context.chat.setOnUserStatus(null);
  }

  onNewMessageReceived = (message) => {
    console.log(message);
  };

  onStatus = (message) => {
    console.log(message);
    if (message.type == "deployment-start") {
      $("#alerttopright").fadeToggle(350).delay(8000).fadeToggle(350);
      $("#alerttoprightTitle").text("Deployment Start");
      $("#alerttoprightBody").text("Deployment Started for " + message.name);
    }
    if (
      message.type == "deployment-success" ||
      message.type == "deployment-exit"
    ) {
      $("#alerttopright").fadeToggle(350).delay(8000).fadeToggle(350);
      $("#alerttoprightTitle").text("Deployment Success");
      $("#alerttoprightBody").text("Deployment Successful for " + message.name);
    }
  };

  render() {
    return (
      <>
        {/* <div class="row" style={{ background: "black", color: "white" }}>
          {this.state.messages.map((message) => {
            <div class="col-md-12">{{ message }}</div>;
          })}
        </div> */}
      </>
    );
  }
}
