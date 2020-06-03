<template>
  <div>
    <Header>
      <div class="regist">
        <div :style="{ 'padding-top': '100px' }">
          <div class="form-container">
            <el-form
              :model="form"
              :ref="form"
              :rules="rules"
              class="form"
              label-width="80px"
            >
              <el-form-item label="用户名" prop="name">
                <el-input
                  v-model="form.name"
                  placeholder="请输入用户名"
                ></el-input>
              </el-form-item>
              <el-form-item label="账号" prop="account">
                <el-input
                  v-model="form.account"
                  placeholder="请输入邮箱注册"
                ></el-input>
              </el-form-item>
              <el-form-item label="密码" prop="password">
                <el-input
                  v-model="form.password"
                  placeholder="请输入密码"
                  show-password
                ></el-input>
              </el-form-item>
              <el-form-item label="确认密码" prop="repeat">
                <el-input
                  v-model="form.repeat"
                  placeholder="请重复密码"
                  show-password
                ></el-input>
              </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
              <el-button size="medium" @click="regist(form)">注 册</el-button>
            </span>
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
          return callback(new Error("请输入正确的邮箱地址"));
        } else if (!reg.test(value)) {
          return callback(new Error("请输入正确的邮箱地址"));
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
        if (value.length < 6) {
          return callback(new Error("密码长度不能少于6个字符"));
        } else if (value.length > 30) {
          return callback(new Error("密码长度不能多于30个字符"));
        } else {
          callback();
        }
      });
    };

    let checkRepeat = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("请输入密码"));
      }
      setTimeout(() => {
        if (value != this.form.password) {
          return callback(new Error("两次输入的密码不一致"));
        } else {
          callback();
        }
      });
    };

    let checkName = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("请输入用户名"));
      }
      setTimeout(() => {
        if (value.replace(/ /g, "") === "") {
          return callback(new Error("用户名不能为空"));
        } else {
          callback();
        }
      });
    };

    return {
      form: {
        account: "",
        password: "",
        repeat: "",
        name: "",
      },
      rules: {
        account: [
          { required: false, validator: checkAccount, trigger: "blur" },
        ],
        password: [
          { required: false, validator: checkPassword, trigger: "blur" },
        ],
        repeat: [{ required: false, validator: checkRepeat, trigger: "blur" }],
        name: [{ required: false, validator: checkName, trigger: "blur" }],
      },
    };
  },

  methods: {
    regist(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$axios
            .post("/api/users/regist", {
              name: this.form.name,
              email: this.form.account,
              password: this.form.password,
            })
            .then((ret) => {
              this.$showMessage(ret.data);
              if (ret.data.code === 200) {
                this.$router.replace("/login");
              }
            })
            .catch((err) => {
              console.log(err);
              this.$showMessage({ msg: err });
            });
        }
      });
    },
  },
};
</script>

<style scoped>
.regist {
  background: url("../assets/background.jpg") no-repeat;
  height: 780px;
}

.form-container {
  width: 450px;
  height: 345px;
  border-radius: 10px;
  background-color: #f5f5f5;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  margin: 0 auto;
}

.form {
  margin: 0 40px 0 10px;
  padding: 40px 0 0 0;
  width: 400px;
}
</style>
