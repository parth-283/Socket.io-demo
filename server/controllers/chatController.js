// server/controllers/chatController.js
const rooms = new Set();

exports.createRoom = (userName) => {
  const roomCode = Math.random().toString(36).substr(2, 8);
  rooms.add(roomCode);
  return roomCode;
};

exports.removeRoom = (roomCode) => {
  rooms.delete(roomCode);
  return roomCode;
};

exports.isValidRoom = (roomCode) => {
  return rooms.has(roomCode);
};
