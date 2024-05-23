const { createProxyMiddleware } = require("http-proxy-middleware");

const CLIENT_URL = "http://localhost:3000";

const proxyMiddleware = createProxyMiddleware({
  target: CLIENT_URL,
  changeOrigin: true,
  pathRewrite: {
    "^/": "/", // remove base path
  },
});

module.exports = proxyMiddleware;
