const path = require("path");
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");
const autoprefixer = require("autoprefixer");
const CaseSensitivePathsPlugin = require("case-sensitive-paths-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ModuleScopePlugin = require("react-dev-utils/ModuleScopePlugin");
const paths = require("./paths");

// Webpack uses `publicPath` to determine where the app is being served from.
// In development, we always serve from the root. This makes config easier.
const publicPath = "/";

// This is the development configuration.
// It is focused on developer experience and fast rebuilds.
// The production configuration is different and lives in a separate file.
module.exports = {
  mode: "development",
  target: ["web", "es2023"],
  devtool: "cheap-module-source-map",
  // These are the "entry points" to our application.
  // This means they will be the "root" imports that are included in JS bundle.
  // The first two entry points enable "hot" CSS and auto-refreshes for JS.
  entry: [
    // Use the standard webpack-dev-server client instead of react-dev-utils custom client
    // to avoid webpack 5 compatibility issues
    require.resolve("webpack-dev-server/client"),
    require.resolve("webpack/hot/dev-server"),
    // Finally, this is your app's code:
    paths.appIndexJs,
    // We include the app code last so that if there is a runtime error during
    // initialization, it doesn't blow up the WebpackDevServer client, and
    // changing JS code would still trigger a refresh.
  ],
  output: {
    // Add /* filename */ comments to generated require()s in the output.
    pathinfo: true,
    // This does not produce a real file. It's just the virtual path that is
    // served by WebpackDevServer in development. This is the JS bundle
    // containing code from all our entry points, and the Webpack runtime.
    filename: "static/js/bundle.js",
    // There are also additional JS chunk files if you use code splitting.
    chunkFilename: "static/js/[name].chunk.js",
    // This is the URL that app is served from. We use "/" in development.
    publicPath,
    // Point sourcemap entries to original disk location (format as URL on Windows)
    devtoolModuleFilenameTemplate: (info) =>
      path.resolve(info.absoluteResourcePath).replace(/\\/g, "/"),
    // Clean output directory before builds
    clean: true,
  },
  cache: {
    type: "filesystem",
  },
  resolve: {
    // This allows you to set a fallback for where Webpack should look for modules.
    // We placed these paths second because we want `node_modules` to "win"
    // if there are any conflicts. This matches Node resolution mechanism.
    modules: ["node_modules", paths.appNodeModules],
    extensions: [".js", ".ts", ".tsx"],
    alias: {
      // TypeScript path mappings
      "@common": path.resolve(__dirname, "../src/common"),
      "@server": path.resolve(__dirname, "../src/server"),
      "@client": path.resolve(__dirname, "../src/client"),
    },
    plugins: [
      // Prevents users from importing files from outside of src/ (or node_modules/).
      // This often causes confusion because we only process files within src/ with babel.
      // To fix this, we prevent you from importing files out of src/ -- if you'd like to,
      // please link the files into your node_modules/ and let module-resolution kick in.
      // Make sure your source files are compiled, as they will not be processed in any way.
      new ModuleScopePlugin(paths.appSrc, [
        paths.appPackageJson,
        // These are needed for React Fast Refresh (state-preserving HMR)
        require.resolve("react-refresh/runtime"),
        require.resolve("@pmmmwh/react-refresh-webpack-plugin/overlay"),
        require.resolve("@pmmmwh/react-refresh-webpack-plugin/lib"),
      ]),
    ],
  },
  module: {
    rules: [
      // "oneOf" will traverse all following loaders until one will
      // match the requirements. When no loader matches it will fall
      // back to the "file" loader at the end of the loader list.
      {
        oneOf: [
          // Process images
          {
            test: [/\.png$/],
            type: "asset",
            parser: {
              dataUrlCondition: {
                maxSize: 10000,
              },
            },
            generator: {
              filename: "static/media/[name].[hash:8][ext]",
            },
          },
          // Process TS/TSX with TypeScript loader.
          {
            test: /\.(ts|tsx)$/,
            include: paths.appSrc,
            use: [
              // The only reason we still need babel-loader is for React Fast Refresh.
              {
                loader: require.resolve("babel-loader"),
                options: {
                  plugins: [require.resolve("react-refresh/babel")],
                },
              },
              {
                loader: require.resolve("ts-loader"),
                options: {
                  configFile: path.resolve(paths.appSrc, "client", "tsconfig.json"),
                  transpileOnly: true,
                },
              },
            ],
          },
          // "postcss" loader applies autoprefixer to our CSS.
          // "css" loader resolves paths in CSS and adds assets as dependencies.
          // "style" loader turns CSS into JS modules that inject <style> tags.
          // In production, we use a plugin to extract that CSS to a file, but
          // in development "style" loader enables hot editing of CSS.
          {
            test: /\.css$/,
            use: [
              require.resolve("style-loader"),
              {
                loader: require.resolve("css-loader"),
                options: {
                  importLoaders: 1,
                },
              },
              {
                loader: require.resolve("postcss-loader"),
                options: {
                  postcssOptions: {
                    plugins: [autoprefixer({ flexbox: "no-2009" })],
                  },
                },
              },
            ],
          },
          // "file" loader makes sure those assets get served by WebpackDevServer.
          // When you `import` an asset, you get its (virtual) filename.
          // In production, they would get copied to the `build` folder.
          // This loader doesn't use a "test" so it will catch all modules
          // that fall through the other loaders.
          {
            // Exclude `js` files to keep "css" loader working as it injects
            // its runtime that would otherwise processed through "file" loader.
            // Also exclude `html` and `json` extensions so they get processed
            // by webpacks internal loaders.
            exclude: [/\.(js|mjs)$/, /\.html$/, /\.json$/],
            type: "asset/resource",
            generator: {
              filename: "static/media/[name].[hash:8][ext]",
            },
          },
        ],
      },
    ],
  },
  plugins: [
    // Generates an `index.html` file with the <script> injected.
    new HtmlWebpackPlugin({
      inject: true,
      template: paths.appHtml,
    }),
    // See https://github.com/facebookincubator/create-react-app/issues/240
    new CaseSensitivePathsPlugin(),
    // React Fast Refresh (state-preserving HMR)
    new ReactRefreshWebpackPlugin(),
  ],
  // Turn off performance hints during development because we don't do any
  // splitting or minification in interest of speed. These warnings become
  // cumbersome.
  performance: {
    hints: false,
  },
};
