import Vue from "vue";
import VueRouter from "vue-router";
import Login from "@/views/Login.vue";
import Edit from "@/views/Edit.vue";
import Home from "@/views/Home.vue";
import Regist from "@/views/Register.vue";
import User from "@/views/User.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/edit",
    name: "Edit",
    component: Edit,
  },
  {
    path: "/user",
    name: "User",
    component: User,
  },
  {
    path: "/regist",
    name: "Regist",
    component: Regist,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
