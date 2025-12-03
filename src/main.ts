import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import Antd from "ant-design-vue";
import "ant-design-vue/dist/reset.css";
import VueLazyLoad from "vue3-lazyload";
import "../global.css"; // 引入全局样式

createApp(App)
  .use(router)
  .use(Antd)
  .use(VueLazyLoad, {
    loading: "", //加载中图片地址
  })
  .mount("#app");
