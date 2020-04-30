import http from "http";
import SocketIoHandlers from "./../socketio/SocketIoHandlers";
import io from "socket.io";

export default function SocketEngine(app, socketIoCallback) {
  const httpApp = http.createServer(app);
  const socketIo = io(httpApp);
  SocketIoHandlers(socketIo, socketIoCallback);
  return httpApp;
}
