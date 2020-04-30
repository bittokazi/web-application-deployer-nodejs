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
    };
  }

  componentDidMount() {
    this.context.chat.setChatComponentConnect(this.connect);
    this.connect();
  }

  connect = () => {
    if (
      !this.context.chat.connected &&
      this.context.chat.connectChat &&
      !this.state.loaded
    ) {
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
            //this.context.chat.setOnMessageReceive(this.onNewMessageReceived);
          }, resolve.data.token);
        },
        (error) => {}
      );
    }
  };

  componentWillUnmount() {
    this.context.chat.disconnect();
    this.context.chat.setChatComponentConnect(null);
    // this.context.chat.setOnRoomList(null);
  }

  // onChatServerDisconnect = () => {
  //   console.log("disconnected");
  //   this.setState({
  //     connected: false,
  //   });
  // };

  // onScrolltoTop = () => {
  //   this.fetchHistoryOfRoom(
  //     this.state.selectedRoom.roomUid,
  //     this.state.timestamp
  //   );
  // };

  onNewMessageReceived = (message) => {
    console.log(message);
  };

  onSendNewMessage = () => {
    this.context.chat.sendMessage(
      this.state.selectedRoom.roomUid,
      this.state.text,
      (message) => {
        console.log("sent", message);
      }
    );
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
