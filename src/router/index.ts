import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "home",
    component: () => import("@/views/home/home.vue"),
  },
  {
    path: "/mainContent",
    name: "mainCon",
    component: () => import("@/views/mainContent/mainContent.vue"),
  },
  {
    path: "/Spmusic",
    name: "spmusic",
    component: () => import("@/views/Spmusic/Spmusic.vue"),
  },
  {
    path: "/Picarea",
    name: "picarea",
    component: () => import("@/views/picarea/picarea.vue"),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
