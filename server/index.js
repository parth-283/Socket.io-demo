// server/server.js
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const { createProxyMiddleware } = require('http-proxy-middleware');
const path = require('path');
const socketConfig = require('./config/socket');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

// Proxy requests to the live URL of the React app
const CLIENT_URL = 'http://localhost:3000';
app.use(
  '/',
  createProxyMiddleware({
    target: CLIENT_URL,
    changeOrigin: true,
    pathRewrite: {
      '^/': '/', // remove base path
    },
  })
);

socketConfig(io);

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
