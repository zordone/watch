const paths = require("./paths");

const protocol = process.env.HTTPS === "true" ? "https" : "http";
const host = process.env.HOST || "0.0.0.0";

module.exports = function (proxy, allowedHost) {
  return {
    // WebpackDevServer 5.x basic configuration
    port: process.env.PORT || 3000,
    host: host,
    allowedHosts: allowedHost ? [allowedHost] : "auto",
    compress: true,
    hot: true,
    historyApiFallback: {
      disableDotRule: true,
    },
    static: {
      directory: paths.appPublic,
      watch: true,
    },
    server: protocol === "https" ? "https" : "http",
    proxy,
  };
};
