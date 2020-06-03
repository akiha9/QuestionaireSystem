<template>
  <div>
    <el-dialog
      title="添加依赖"
      :visible.sync="visible"
      width="40%"
      center
      :before-close="cancelAddRelative"
    >
      <div class="label">题目：</div>
      <el-input
        v-model="form.content"
        autocomplete="off"
        disabled
        :rows="3"
        type="textarea"
      ></el-input>
      <el-form :model="form" :ref="form" :rules="rules"
        ><div
          v-for="(option, optionIndex) in form.optionList"
          :key="optionIndex"
        >
          <div class="option-op">
            <div class="option-index fl">选项 {{ optionIndex + 1 }}：</div>
            <div class="op fr">
              <a href="javascript:;" @click="addRelative(optionIndex)">
                <i class="el-icon-circle-plus-outline"></i>
              </a>
            </div>
          </div>
          <el-input v-model="form.optionList[optionIndex]" disabled></el-input>

          <div
            v-if="visible && form.relative[optionIndex].length !== 0"
            class="relative"
          >
            <div class="relative-label">依赖项：</div>
            <div
              v-for="(relative, relativeIndex) in form.relative[optionIndex]"
              :key="relativeIndex"
              class="relative-item"
            >
              <el-form-item
                :prop="`relative.${optionIndex}.${relativeIndex}`"
                :rules="rules.relative"
                ><el-select
                  v-model="form.relative[optionIndex][relativeIndex]"
                  :placeholder="
                    list[optionIndex].length === 0
                      ? '没有可以添加的题目'
                      : '请选择'
                  "
                  ><el-option
                    v-for="question in list[optionIndex]"
                    :key="question[0]"
                    :label="question[1]"
                    :value="question[0]"
                  ></el-option
                ></el-select>
                <span class="remove fr"
                  ><a
                    href="javascript:;"
                    @click="removeRelative(optionIndex, relativeIndex)"
                  >
                    <i class="el-icon-remove-outline"></i> </a></span
              ></el-form-item>
            </div>
          </div></div
      ></el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelAddRelative">取 消</el-button>
        <el-button @click="handleSubmit(form)" type="primary">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  props: ["visible", "questionList"],
  data() {
    let checkRelative = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("依赖不能为空"));
      }
      callback();
    };

    return {
      list: [],
      rules: {
        relative: [
          { required: false, validator: checkRelative, triger: "blur" },
        ],
      },
    };
  },

  computed: {
    ...mapState({ form: "form" }),
  },

  watch: {
    visible(curVal, oldVal) {
      if (curVal === true) {
        this.form.relative.forEach((relatives, index) => {
          if (relatives.length > 0) {
            this.buildList(index);
          }
        });
      }
    },
  },

  methods: {
    cancelAddRelative() {
      this.list = [];
      this.$emit("cancelAddRelative");
      this.$store.commit("clearForm");
    },

    addRelative(optionIndex) {
      this.form.relative[optionIndex].push("");
      this.buildList(optionIndex);
    },

    removeRelative(optionIndex, relativeIndex) {
      this.form.relative[optionIndex].splice(relativeIndex, 1);
    },

    buildList(optionIndex) {
      if (this.list.length === 0) {
        this.form.optionList.forEach((option) => {
          this.list.push([]);
        });
      }
      if (this.list[optionIndex].length !== 0) {
        return;
      }
      for (let i = this.form.index + 1; i < this.questionList.length; ++i) {
        if (this.hasNoRelative(i)) {
          this.list[optionIndex].push([i, this.questionList[i].content]);
        }
      }
    },

    hasNoRelative(index) {
      let ret = true;
      this.questionList.forEach((question) => {
        if (question.index !== this.form.index) {
          question.relative.forEach((relative) => {
            relative.forEach((relativeIndex) => {
              if (relativeIndex === index) {
                ret = false;
              }
            });
          });
        }
      });
      return ret;
    },

    unique(arr) {
      let tmp = [];
      arr.forEach((x) => {
        if (tmp.indexOf(x) === -1) {
          tmp.push(x);
        }
      });
      return tmp;
    },

    // 进行去重处理
    handleSubmit(formName) {
      const _this = this;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.form.relative.forEach((relatives, index) => {
            _this.form.relative[index] = _this.unique(relatives);
            relatives.forEach((questionIndex) => {});
          });
          this.$emit("handleSubmit");
          this.$emit("cancelAddRelative");
          this.list = [];
        }
      });
    },
  },
};
</script>

<style scoped>
.fl {
  float: left;
}

.fr {
  float: right;
}

.option-op,
.relative-label {
  height: 30px;
  line-height: 30px;
}

.remove {
  height: 40px;
  line-height: 40px;
  margin-right: 5px;
}

.op {
  margin-right: 5px;
}

.label {
  margin: 8px 0;
}

a {
  text-decoration: none;
  color: #1e90ff;
}

a:hover {
  color: #1682eb;
}

.relative-item {
  margin-bottom: 5px;
}
</style>
