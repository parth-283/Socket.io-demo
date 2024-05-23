// server/config/socket.js
const socketService = require('../services/chatService');

module.exports = (io) => {
  socketService(io);
};
