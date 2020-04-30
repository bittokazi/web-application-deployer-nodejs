import AuthHandler from "./AuthHandler";
import ConnectionEvents from "./@connection-events/ConnectionEvents";

export default function SocketIoHandlers(socketIo, socketIoCallback) {
  socketIo = AuthHandler(socketIo);
  socketIoCallback(socketIo);
  let userOnlineStatus = {};
  socketIo.on("authenticated", (socket) => {
    const user = {
      tenant: socket.decoded_token.tenant,
      id: socket.decoded_token.id,
      name: socket.decoded_token.name,
    };
    console.log("Connection Authenticated!!!");
    ConnectionEvents(socketIo, socket, user, userOnlineStatus);
  });
}
