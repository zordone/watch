module.exports = function (api) {
  api.cache(true);

  const presets = [
    [
      "@babel/preset-env",
      {
        targets: {
          chrome: "110",
          firefox: "110",
          safari: "16.4",
          edge: "110",
        },
        modules: false,
        useBuiltIns: "entry",
        corejs: 3,
      },
    ],
    [
      "@babel/preset-react",
      {
        runtime: "automatic",
      },
    ],
  ];

  const plugins = process.env.NODE_ENV === "development" ? ["react-refresh/babel"] : [];

  return {
    presets,
    plugins,
  };
};
