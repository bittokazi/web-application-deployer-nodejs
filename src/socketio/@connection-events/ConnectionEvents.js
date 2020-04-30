export default function ConnectionEvents(
  socketIo,
  socket,
  user,
  userOnlineStatus
) {
  socket.conn.on("heartbeat", () => {});

  socket.on("disconnect", () => {
    console.log("Disconnected user", user.id, user.tenant);
  });
}
