import axios from "axios";
import router from "@/router";
import ElementUI from "element-ui";

const baseURL = process.env.VUE_APP_API;
const CODE_INVAILID_TOKEN = 401;

let instance = axios.create({
  baseURL,
});

instance.defaults.withCredentials = false;

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = token;
    }
    return config;
  },
  (err) => {
    return Promise.reject(err);
  }
);

instance.interceptors.response.use(
  (res) => {
    if (res.data.code == CODE_INVAILID_TOKEN) {
      ElementUI.Message({
        type: "error",
        duration: 3000,
        message: res.data.msg,
        showClose: true,
      });
      localStorage.removeItem("token");
      router.replace("/login");
    }
    return res;
  },
  (err) => {
    return Promise.reject(err);
  }
);

export default instance;
