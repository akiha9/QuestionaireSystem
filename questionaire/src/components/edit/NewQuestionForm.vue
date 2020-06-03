<template>
  <div>
    <el-dialog
      title="添加问题"
      :visible.sync="$store.state.addQuestionDialogVisible"
      width="40%"
      center
    >
      <el-form :model="form" :ref="form" :rules="questionRules">
        <el-form-item label="题目:" prop="content">
          <el-input
            v-model="form.content"
            autocomplete="off"
            placeholder="请输入题目"
            :rows="3"
            type="textarea"
          ></el-input>
        </el-form-item>
        <template v-if="form.type === 0 || form.type === 1">
          <el-form-item
            v-for="(option, optionIndex) in form.optionList"
            :key="optionIndex"
            :prop="`optionList.${optionIndex}`"
            :rules="questionRules.option"
          >
            <div class="option-op">
              <div class="option-index fl">选项{{ optionIndex + 1 }}：</div>
              <div class="op fr">
                <a href="javascript:;" @click="moveUp(optionIndex)">
                  <i class="el-icon-top"></i>
                </a>
                <a href="javascript:;" @click="moveDown(optionIndex)">
                  <i class="el-icon-bottom"></i>
                </a>
                <a href="javascript:;" @click="addOption(optionIndex)">
                  <i class="el-icon-circle-plus-outline"></i>
                </a>
                <a href="javascript:;" @click="removeOption(optionIndex)">
                  <i class="el-icon-remove-outline"></i>
                </a>
              </div>
            </div>
            <el-input
              v-model="form.optionList[optionIndex]"
              placeholder="请输入选项"
            ></el-input>
          </el-form-item>
        </template>
        <template v-if="form.type === 2 || form.type === 3">
          <el-row
            :gutter="20"
            v-for="(blank, blankIndex) in form.typeList"
            :key="blankIndex"
          >
            <el-col :span="8">
              <el-form-item
                label="类型:"
                :prop="`typeList.${blankIndex}.${0}`"
                :rules="questionRules.type"
              >
                <el-select
                  v-model="form.typeList[blankIndex][0]"
                  placeholder="请选择"
                  size="small"
                >
                  <el-option
                    v-for="type in types"
                    :key="type.value"
                    :label="type.label"
                    :value="type.value"
                    >{{ type.label }}</el-option
                  >
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item
                label="最小值:"
                v-if="
                  form.typeList[blankIndex][0] === 0 ||
                    form.typeList[blankIndex][0] === 1
                "
              >
                <el-input-number
                  v-if="form.typeList[blankIndex][0] === 0"
                  size="small"
                  v-model="form.typeList[blankIndex][1]"
                ></el-input-number>
                <el-input-number
                  v-if="form.typeList[blankIndex][0] === 1"
                  :precision="2"
                  size="small"
                  v-model="form.typeList[blankIndex][1]"
                ></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item
                label="最大值:"
                v-if="
                  form.typeList[blankIndex][0] === 0 ||
                    form.typeList[blankIndex][0] === 1
                "
              >
                <el-input-number
                  v-if="form.typeList[blankIndex][0] === 0"
                  size="small"
                  v-model="form.typeList[blankIndex][2]"
                ></el-input-number>
                <el-input-number
                  v-if="form.typeList[blankIndex][0] === 1"
                  :precision="2"
                  size="small"
                  v-model="form.typeList[blankIndex][2]"
                ></el-input-number>
              </el-form-item>
            </el-col>
          </el-row>
        </template>
      </el-form>
      <div v-if="form.type === 0 || form.type === 1">
        <a href="javascript:;" @click="addOption(form.optionList.length - 1)">
          <i class="el-icon-circle-plus-outline"></i> 添加选项
        </a>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelAdd(form)">取 消</el-button>
        <el-button type="primary" @click="submitAdd(form)">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from "vuex";
import _ from "lodash";

export default {
  data() {
    let checkOptions = (rule, value, callback) => {
      if (!value || value.replace(/ /g, "") === "") {
        return callback(new Error("选项不能为空"));
      }
      setTimeout(() => {
        if (value.length > 1000) {
          return callback(new Error("选项不能多于1000个字符"));
        } else {
          callback();
        }
      });
    };

    let checkContent = (rule, value, callback) => {
      if (!value || value.replace(/ /g, "") === "") {
        return callback(new Error("题目不能为空"));
      }
      setTimeout(() => {
        if (value.length > 1000) {
          return callback(new Error("题目不能多于1000个字符"));
        } else {
          callback();
        }
      });
    };

    let checkType = (rule, value, callback) => {
      if (value !== 0 && !value) {
        return callback(new Error("请选择类型"));
      }
      setTimeout(() => {
        callback();
      });
    };

    return {
      types: [
        { value: 0, label: "整数" },
        { value: 1, label: "小数" },
        { value: 2, label: "单行文本" },
        { value: 3, label: "多行文本" },
      ],
      questionRules: {
        content: [
          { required: false, validator: checkContent, trigger: "blur" },
        ],
        option: [{ required: false, validator: checkOptions, trigger: "blur" }],
        type: [{ required: false, validator: checkType, triggger: "blur" }],
      },
    };
  },
  watch: {
    newContent() {
      this.debouncedCreate();
    },
  },
  created() {
    this.debouncedCreate = _.debounce(this.createFill, 1000);
  },
  computed: {
    ...mapState({ form: "form" }),

    newContent() {
      return this.form.content;
    },
  },
  methods: {
    cancelAdd(formName) {
      this.$store.commit("switchVisibility");
      this.$store.commit("clearForm");
    },

    submitAdd(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.form.type === 2 || this.form.type === 3) {
            this.form.typeList.forEach((type) => {
              if (type[0] === 0 || type[0] === 1) {
                if (type[1] > type[2]) {
                  [type[1], type[2]] = [type[2], type[1]];
                }
              }
            });
          }
          this.$store.commit("switchVisibility");
          this.$emit("submit");
        }
      });
    },

    addOption(index) {
      this.form.optionList.splice(index + 1, 0, "");
    },

    removeOption(index) {
      if (this.form.optionList.length === 1) {
        return;
      }
      this.form.optionList.splice(index, 1);
    },

    moveUp(index) {
      if (index === 0) {
        return;
      } else {
        let tmp = this.form.optionList[index];
        let list = this.form.optionList;
        this.$set(list, index, list[index - 1]);
        this.$set(list, index - 1, tmp);
      }
    },

    moveDown(index) {
      if (index === this.form.optionList.length - 1) {
        return;
      } else {
        let tmp = this.form.optionList[index];
        let list = this.form.optionList;
        this.$set(list, index, list[index + 1]);
        this.$set(list, index + 1, tmp);
      }
    },

    createFill() {
      if (this.form.type !== 3) {
        return;
      }
      let reg = /_{3,}/g;
      let match = this.form.content.match(reg);
      if (match === null) {
        return;
      }

      let [oldLen, newLen] = [this.form.typeList.length, match.length];
      if (oldLen > newLen) {
        this.form.typeList.splice(newLen, oldLen - newLen);
      } else if (newLen > oldLen) {
        let newTypes = [];
        for (let i = 1; i <= newLen - oldLen; ++i) {
          newTypes.push(["", "", ""]);
        }
        this.form.typeList.splice(oldLen, 0, ...newTypes);
      }
    },
  },
};
</script>

<style scoped>
a {
  text-decoration: none;
  color: #1e90ff;
}

a:hover {
  color: #1682eb;
}

.fl {
  float: left;
}

.fr {
  float: right;
}

.option-op {
  height: 30px;
  line-height: 30px;
}

.option-op a {
  margin-left: 5px;
}
</style>
