import io from "socket.io-client";
import config from "./../config";

export default class ChatService {
  constructor() {
    this.connected = false;
    this.onMessageReceive = null;
    this.onUserSpace = null;
    this.onDisconnect = null;
    this.onUserStatus = null;
    this.onRoomList = null;
    console.log("Chat Service Initiated");
    this.connectChat = false;
    this.chatComponentConnect = null;
    this.token = null;
  }

  connect(callback, token) {
    this.token = token;
    let self = this;
    this.socket = io.connect(config.CHAT_SERVER_URL);
    this.socket.on("connect", () => {
      self.socket
        .on("authenticated", function () {
          self.connected = true;
          self.listenToMessage();
          // self.listenToUserSpace();
          self.listentToDisconnect();
          // self.listenToOnUserStatus();
          // self.getRooms(true).then((rooms) => {
          //   if (callback) callback(rooms);
          //   if (self.onRoomList) self.onRoomList(rooms);
          // });
        })
        .emit("authenticate", {
          token,
        });
    });
  }

  disconnect() {
    if (this.socket) this.socket.close();
    this.connected = false;
  }

  listentToDisconnect() {
    this.socket.on("disconnect", () => {
      if (this.onDisconnect != null) this.onDisconnect();
      this.disconnect();
      this.connect(null, this.token);
    });
  }

  sendMessage(id, callback) {
    if (!this.connected) return;
    this.socket.emit("chat.message.deploy.app", id, (message) => {
      callback(message);
    });
  }

  listenToMessage() {
    this.socket.on("chat.message.deploy", (message) => {
      if (this.onMessageReceive != null) this.onMessageReceive(message);
    });
  }

  setOnMessageReceive(callback) {
    this.onMessageReceive = callback;
  }

  setOnDisconnect(callback) {
    this.onDisconnect = callback;
  }

  setChatComponentConnect(callback) {
    this.chatComponentConnect = callback;
  }

  setOnUserSpace(callback) {
    this.onUserSpace = callback;
  }

  setOnUserStatus(callback) {
    this.onUserStatus = callback;
  }

  setOnRoomList(callback) {
    this.onRoomList = callback;
  }

  connectChatComponent() {
    if (this.chatComponentConnect) this.chatComponentConnect();
  }
}
