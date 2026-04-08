const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  // publicPath: "/T-T--T-J/",
  publicPath: "./",
  // 添加输出目录配置
  outputDir: "dist",
});
