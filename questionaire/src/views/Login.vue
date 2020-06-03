<template>
  <div>
    <Header>
      <div class="login">
        <div :style="{ 'padding-top': '100px' }">
          <div class="form-container">
            <el-form
              :model="form"
              :ref="form"
              :rules="rules"
              class="form"
              label-width="40px"
            >
              <el-form-item label="账号" prop="account">
                <el-input
                  v-model="form.account"
                  placeholder="请输入账号"
                  @keyup.enter.native="login(form)"
                ></el-input>
              </el-form-item>
              <el-form-item label="密码" prop="password">
                <el-input
                  v-model="form.password"
                  placeholder="请输入密码"
                  show-password
                  @keyup.enter.native="login(form)"
                ></el-input>
              </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
              <el-button size="medium" @click="login(form)">登 录</el-button>
            </span>
            <div class="bottom">
              <router-link :to="{ name: 'Regist' }">
                <a href="javascript:;">免费注册</a></router-link
              >
              <a href="javascript:;">忘记密码</a>
            </div>
          </div>
        </div>
      </div>
    </Header>
    <Footer></Footer>
  </div>
</template>

<script>
import Header from "@/components/layout/Header.vue";
import Footer from "@/components/layout/Footer.vue";

export default {
  name: "Login",
  components: {
    Header,
    Footer,
  },
  data() {
    let checkAccount = (rule, value, callback) => {
      let reg = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;
      if (!value) {
        return callback(new Error("请输入账号"));
      }
      setTimeout(() => {
        if (value.length > 40 || value.length < 6) {
          return callback(new Error("请输入正确的账号"));
        } else if (!reg.test(value)) {
          return callback(new Error("请输入正确的账号"));
        } else {
          callback();
        }
      });
    };

    let checkPassword = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("请输入密码"));
      }
      setTimeout(() => {
        if (value.length > 30 || value.length < 6) {
          return callback(new Error("请输入正确的密码"));
        } else {
          callback();
        }
      });
    };

    return {
      form: {
        account: "",
        password: "",
      },
      rules: {
        account: [
          { required: false, validator: checkAccount, trigger: "blur" },
        ],
        password: [
          { required: false, validator: checkPassword, trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    login(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$axios
            .post("/api/users/login", {
              email: this.form.account,
              password: this.form.password,
            })
            .then((ret) => {
              this.$showMessage(ret.data);
              if (ret.data.code === 200) {
                localStorage.setItem("token", ret.data.data.token);
                this.$router.replace("/");
              }
            })
            .catch((err) => {
              console.log(err);
              localStorage.removeItem("token");
              this.$showMessage({ msg: err });
            });
        }
      });
    },
  },
};
</script>

<style scoped>
.login {
  height: 780px;
  background: url("../assets/background.jpg") no-repeat;
  background-size: cover;
}

.form-container {
  width: 450px;
  height: 240px;
  border-radius: 10px;
  background-color: #f5f5f5;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  margin: 0 auto;
}

.form {
  margin: 0 50px;
  padding: 40px 0 0 0;
  width: 350px;
}

.form-container .bottom {
  margin-top: 10px;
  font-size: 14px;
}

.bottom a {
  margin-right: 10px;
  text-decoration: none;
  color: #1e90ff;
}

.bottom a:hover {
  color: #1682eb;
}
</style>
