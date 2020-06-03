import Vue from "vue";
import VueRouter from "vue-router";
import Login from "@/views/Login.vue";
import Edit from "@/views/Edit.vue";
import Home from "@/views/Home.vue";
import Regist from "@/views/Register.vue";
import User from "@/views/User.vue";
import Preview from "@/views/Preview.vue";
import Answer from "@/views/Answer.vue";
import Analysis from "@/views/Analysis.vue";
import Single from "@/views/analysis/Single.vue";
import SingleAnswer from "@/views/analysis/SingleAnswer.vue";
import AllAnswer from "@/views/analysis/AllAnswer.vue";

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
  {
    path: "/preview",
    name: "Preview",
    component: Preview,
  },
  {
    path: "/answer",
    name: "Answer",
    component: Answer,
  },
  {
    path: "/analysis",
    name: "Analysis",
    component: Analysis,
  },
  {
    path: "/analysis/:id/single",
    name: "Single",
    component: Single,
  },
  {
    path: "/analysis/:id/single",
    name: "SingleAnswer",
    component: SingleAnswer,
  },
  {
    path: "/analysis/:id/all",
    name: "AllAnswer",
    component: AllAnswer,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
