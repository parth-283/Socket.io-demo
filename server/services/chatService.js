// server/services/chatService.js
const {
  createRoom,
  isValidRoom,
  removeRoom,
} = require("../controllers/chatController");

module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("New user connected");

    socket.on("create room", (name, callback) => {
      const roomCode = createRoom(name);
      socket.join(roomCode);
      io.to(roomCode).emit("server message", `Welcome to new room ${name}.`);
      callback({ code: roomCode, name });
    });

    socket.on("join room", (roomCode, userName, callback) => {
      if (isValidRoom(roomCode)) {
        socket.join(roomCode);
        io.to(roomCode).emit("server message", `Join new member ${userName}`);
        callback({ success: true });
      } else {
        callback({ success: false, message: "Room not found" });
      }
    });

    socket.on("leave room", (roomCode, userName, callback) => {
      if (isValidRoom(roomCode)) {
        socket.leave(roomCode);
        io.to(roomCode).emit("server message", `${userName} leave to room.`);
        callback({ success: true });
      } else {
        callback({ success: false, message: "Room not found" });
      }
    });

    socket.on("delete room", (oldRoomCode, callback) => {
      if (isValidRoom(oldRoomCode)) {
        removeRoom(oldRoomCode);
        callback({ success: true });
      } else {
        callback({ success: false, message: "Room not found" });
      }
    });

    socket.on("chat message", (roomCode, msg, userName) => {
      if (isValidRoom(roomCode)) {
        io.to(roomCode).emit("chat message", {
          isValidRoom: false,
          roomCode: roomCode,
          message: msg,
          name: userName,
        });
      } else {
        io.to(roomCode).emit("chat message", { isValidRoom: false });
      }
    });

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });
};
