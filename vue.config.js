const { defineConfig } = require("@vue/cli-service");
const path = require("path");
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  // publicPath: "/T-T--T-J/",
  publicPath: "./",
  // 添加输出目录配置
  outputDir: "dist",
  configureWebpack: {
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
    },
  },
  devServer: {
    proxy: {
      "/github-api": {
        target: "https://api.github.com",
        changeOrigin: true,
        secure: true,
        pathRewrite: {
          "^/github-api": "",
        },
        onProxyRes: (proxyRes) => {
          delete proxyRes.headers["content-encoding"];
          delete proxyRes.headers["content-length"];
        },
      },
    },
  },
});
