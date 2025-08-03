module.exports = function (api) {
  api.cache(true);

  const presets = [
    ["@babel/preset-env", { modules: false }],
    ["@babel/preset-react", { runtime: "automatic" }],
  ];

  const plugins = process.env.NODE_ENV === "development" ? ["react-refresh/babel"] : [];

  return {
    presets,
    plugins,
  };
};
