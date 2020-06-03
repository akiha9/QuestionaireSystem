import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import ElementUI from "element-ui";
import axios from "./config/axios";
import store from "./store";
import utils from "./utils/index";
import VueClipboard from "vue-clipboard2";
import "element-ui/lib/theme-chalk/index.css";

Vue.prototype.$axios = axios;
Vue.prototype.utils = utils;
Vue.config.productionTip = false;
Vue.use(ElementUI);
Vue.use(VueClipboard);

Vue.prototype.$showMessage = function(data) {
  let obj = {
    message: data.msg,
    type: data.code == 200 ? "success" : "error",
    duration: 1500,
    showClose: true,
  };
  this.$message(obj);
};

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
