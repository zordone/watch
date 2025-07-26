const paths = require("./paths");

module.exports = function (proxy, allowedHost) {
  return {
    port: process.env.PORT || 3000,
    host: process.env.HOST || "0.0.0.0",
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
    server: process.env.HTTPS === "true" ? "https" : "http",
    proxy,
    client: {
      logging: "warn", // none | warn | error
    },
  };
};
