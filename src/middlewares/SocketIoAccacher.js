export function SocketIoAccacher(socketIoCallback) {
  return function (req, res, next) {
    req.socketIo = socketIoCallback.socket;
    next();
  };
}
