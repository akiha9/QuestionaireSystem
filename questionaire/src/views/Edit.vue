<template>
  <div>
    <Header>
      <div class="edit">
        <div class="aside">
          <div class="aside-content">
            <div class="select">
              <a href="javascript:;" @click="showSelect = !showSelect">
                <strong>选择题</strong>
              </a>
              <el-collapse-transition>
                <div v-show="showSelect">
                  <a href="javascript:;" @click="clickAddNewQuestion(0)">
                    <div class="type">单项选择</div>
                  </a>
                  <a href="javascript:;" @click="clickAddNewQuestion(1)">
                    <div class="type">多项选择</div>
                  </a>
                </div>
              </el-collapse-transition>
            </div>
            <div class="fill-class">
              <a href="javascript:;" @click="showFill = !showFill">
                <strong>填空题</strong>
              </a>
              <el-collapse-transition>
                <div v-show="showFill">
                  <a href="javascript:;" @click="clickAddNewQuestion(2)">
                    <div class="type">单项填空</div>
                  </a>
                  <a href="javascript:;" @click="clickAddNewQuestion(3)">
                    <div class="type">多项填空</div>
                  </a>
                </div>
              </el-collapse-transition>
            </div>
            <div class="rate-class">
              <a href="javascript:;" @click="showRate = !showRate">
                <strong>评分题</strong>
              </a>
              <el-collapse-transition>
                <div v-show="showRate">
                  <a href="javascript:;" @click="clickAddNewQuestion(4)">
                    <div class="type">评分单选</div>
                  </a>
                </div>
              </el-collapse-transition>
            </div>
            <div class="high-level">
              <a href="javascript:;" @click="showHigh = !showHigh">
                <strong>高级题型</strong>
              </a>
              <el-collapse-transition>
                <div v-show="showHigh">
                  <a href="javascript:;" @click="clickAddNewQuestion(5)">
                    <div class="type">地理位置</div>
                  </a>
                </div>
              </el-collapse-transition>
            </div>
          </div>
        </div>
        <div class="main">
          <div :style="{ 'padding-top': '10px' }"></div>
          <div class="edit-area">
            <div class="title" @click="changeTitleDialogVisible = true">
              <div class="sheet-name">{{ sheet.sheetName }}</div>
              <div class="sheet-description">
                {{
                sheet.sheetDescription === ""
                ? "添加问卷说明"
                : sheet.sheetDescription
                }}
              </div>
            </div>
            <div class="first-line">
              <div class="number">[共 {{ sheet.questionList.length }} 题]</div>
              <div
                style="margin-left: 50px;"
                class="add"
                v-if="insertIndex !== 0"
                @click="insertIndex = 0"
              >
                <a href="javascript:;">在此题后插入新题</a>
              </div>
              <div style="margin-left: 50px;" class="add" v-else @click="insertIndex = ''">
                <a href="javascript:;">取消插入点</a>
              </div>
            </div>
            <div
              class="single-question"
              v-for="(question, index) in sheet.questionList"
              :key="index"
            >
              <div class="question-content">
                <div class="question-title">
                  <font color="red">*</font>
                  <strong>
                    {{ question.content }}
                    <template v-if="question.type === 1">(多选)</template>
                  </strong>
                </div>
                <template v-if="question.type === 0 || question.type === 1">
                  <div
                    class="option"
                    v-for="(option, optionIndex) in question.optionList"
                    :key="optionIndex"
                  >
                    <el-radio disabled v-model="tmp">{{ option }}</el-radio>
                  </div>
                </template>
                <template v-if="question.type === 2 || question.type === 3">
                  <div class="fill" v-for="(type, typeIndex) in question.typeList" :key="typeIndex">
                    <el-input
                      v-if="type[0] === 2 || type[0] === 3"
                      size="small"
                      type="textarea"
                      :disabled="true"
                      :rows="type[0] === 2 ? 1 : 3"
                    ></el-input>
                    <el-input-number
                      v-if="type[0] === 0"
                      size="small"
                      :min="type[1]"
                      :max="type[2]"
                      disabled
                    ></el-input-number>
                    <el-input-number
                      v-if="type[0] === 1"
                      size="small"
                      :precision="2"
                      :min="type[1]"
                      :max="type[2]"
                      disabled
                    ></el-input-number>
                  </div>
                </template>
                <template v-if="question.type === 4">
                  <div class="rate">
                    <el-rate disabled></el-rate>
                  </div>
                </template>
                <template v-if="question.type === 5">
                  <div class="pos">
                    <i class="el-icon-position"></i> 点击获取地理位置
                  </div>
                </template>
                <div class="question-add">
                  <div class="add fr" @click="moveDown(index)">
                    <a href="javascript:;">
                      <i class="el-icon-bottom"></i>
                    </a>
                  </div>
                  <div class="add fr" @click="moveUp(index)">
                    <a href="javascript:;">
                      <i class="el-icon-top"></i>
                    </a>
                  </div>
                  <div class="add fr" @click="deleteQuestion(index)">
                    <a href="javascript:;">删除</a>
                  </div>
                  <div class="add fr" @click="clickEditQuestion(index)">
                    <a href="javascript:;">编辑</a>
                  </div>
                  <div
                    class="add fl"
                    v-if="insertIndex !== index + 1"
                    @click="insertIndex = index + 1"
                  >
                    <a href="javascript:;">在此题后插入新题</a>
                  </div>
                  <div class="add" v-else @click="insertIndex = ''">
                    <a href="javascript:;">取消插入点</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <el-dialog :visible.sync="changeTitleDialogVisible" :width="'40%'">
            <el-form :model="form" :rules="titleRules" :ref="form">
              <el-form-item label="标题:" prop="sheetName">
                <el-input v-model="form.sheetName" autocomplete="off" placeholder="请输入问卷标题"></el-input>
              </el-form-item>
              <el-form-item label="描述:" prop="sheetDescription">
                <el-input
                  type="textarea"
                  v-model="form.sheetDescription"
                  autocomplete="off"
                  placeholder="请输入问卷描述"
                  :rows="5"
                ></el-input>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="cancelChangeTitle(form)">取 消</el-button>
              <el-button type="primary" @click="changeTitle(form)">确 定</el-button>
            </div>
          </el-dialog>
        </div>
        <Form @submit="handleSubmit"></Form>
      </div>
    </Header>
    <Footer></Footer>
  </div>
</template>

<script>
import Header from "@/components/layout/Header.vue";
import Footer from "@/components/layout/Footer.vue";
import Form from "@/components/edit/NewQuestionForm.vue";
import _ from "lodash";

export default {
  name: "Edit",
  components: {
    Header,
    Footer,
    Form
  },
  data() {
    let checkTitle = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("标题不能为空"));
      }
      setTimeout(() => {
        if (value.length > 30) {
          return callback(new Error("标题不能多于30个字符"));
        } else {
          callback();
        }
      });
    };

    let checkDescription = (rule, value, callback) => {
      setTimeout(() => {
        if (value && value.length > 140) {
          return callback(new Error("描述不能多于140个字符"));
        } else {
          callback();
        }
      });
    };

    return {
      showSelect: false,
      showFill: false,
      showRate: false,
      showHigh: false,
      changeTitleDialogVisible: false,
      insertIndex: "",
      modifiedIndex: "",
      tmp: "",
      sheet: {
        sheetName: "问卷1",
        sheetDescription: "一个测试问卷",
        questionList: [
          {
            type: 0,
            index: 0,
            content:
              "请问您的性别是请问您的性别是请问您的性别是请问您的性别是请问您的性别是请问您的性别是请问您的性别是请问您的性别是请问您的性别是",
            optionList: [
              "男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男",
              "女",
              "其他"
            ],
            typeList: []
          },
          {
            type: 1,
            index: 1,
            content: "请问您的性别是",
            optionList: ["男", "女", "其他"],
            typeList: []
          },
          {
            type: 4,
            index: 2,
            content: "对我们的服务打分",
            optionList: [],
            typeList: []
          },
          {
            type: 5,
            index: 3,
            content: "请问您的当前位置是",
            optionList: [],
            typeList: []
          },
          {
            type: 2,
            index: 4,
            content: "请问您的性别是",
            optionList: [],
            typeList: [[2]]
          },
          {
            type: 2,
            index: 5,
            content: "请问您的年龄是",
            optionList: [],
            typeList: [[0, 1, 100]]
          },
          {
            type: 3,
            index: 6,
            content:
              "请问您的性别是___，请问您的年龄是___，请问您的学校是____。",
            optionList: [],
            typeList: [[2], [0, 20, 100], [3]]
          },
          {
            type: 0,
            index: 7,
            content: "请问您的性别是",
            optionList: ["男", "女", "其他"],
            typeList: []
          }
        ]
      },
      form: {
        sheetName: "",
        sheetDescription: ""
      },
      newQuestionForm: {},
      titleRules: {
        sheetName: [
          { required: false, validator: checkTitle, trigger: "blur" }
        ],
        sheetDescription: [
          { required: false, validator: checkDescription, trigger: "blur" }
        ]
      }
    };
  },
  mounted() {},

  methods: {
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },

    resetIndex() {
      this.sheet.questionList.forEach((question, index) => {
        question.index = index;
      });
    },

    changeTitle(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.changeTitleDialogVisible = false;
          this.sheet.sheetName = this.form.sheetName;
          this.sheet.sheetDescription = this.form.sheetDescription;
          this.resetForm(formName);
        }
      });
    },

    cancelChangeTitle(formName) {
      this.changeTitleDialogVisible = false;
      this.resetForm(formName);
    },

    clickAddNewQuestion(type) {
      this.$store.commit("clearForm");
      this.$store.commit("changeFormType", { type: type });
      this.$store.commit("switchVisibility");
    },

    clickEditQuestion(index) {
      this.modifiedIndex = index;
      this.$store.commit("changeForm", {
        form: this.sheet.questionList[index]
      });
      this.$store.commit("switchVisibility");
    },

    deleteQuestion(index) {
      this.sheet.questionList.splice(index, 1);
    },

    moveUp(index) {
      if (index === 0) {
        return;
      } else {
        let tmp = this.sheet.questionList[index];
        let list = this.sheet.questionList;
        this.$set(list, index, list[index - 1]);
        this.$set(list, index - 1, tmp);
        list[index].index++;
        list[index - 1].index--;
      }
    },

    moveDown(index) {
      if (index === this.sheet.questionList.length - 1) {
        return;
      } else {
        let tmp = this.sheet.questionList[index];
        let list = this.sheet.questionList;
        this.$set(list, index, list[index + 1]);
        this.$set(list, index + 1, tmp);
        list[index].index--;
        list[index + 1].index++;
      }
    },

    handleSubmit() {
      let newQuestion = _.cloneDeep(this.$store.state.form);
      this.$store.commit("clearForm");

      if (this.insertIndex === "" && this.modifiedIndex === "") {
        newQuestion.index = this.sheet.questionList.length;
        this.sheet.questionList.splice(
          this.sheet.questionList.length,
          0,
          newQuestion
        );
      } else if (this.modifiedIndex !== "") {
        this.sheet.questionList.splice(this.modifiedIndex, 1, newQuestion);
        this.modifiedIndex = "";
      } else {
        this.sheet.questionList.splice(this.insertIndex, 0, newQuestion);
        this.resetIndex();
      }
    }
  }
};
</script>

<style scoped>
.edit {
  height: 780px;
}

.aside {
  float: left;
  width: 200px;
  height: 780px;
}

.aside-content {
  margin: 10px 10px 10px 20px;
  height: 760px;
  border-right: 1px solid #eaeaea;
  text-align: left;
}

.aside-content strong {
  font-size: 15px;
}

.aside-content .select,
.fill-class,
.rate-class,
.high-level {
  margin-bottom: 15px;
}

.main {
  margin-left: 200px;
}

a {
  text-decoration: none;
  color: #696969;
}

.aside-content .type {
  margin-top: 8px;
  color: #696969;
  font-size: 14px;
  border-radius: 30px;
  height: 20px;
  line-height: 20px;
  width: 80px;
  text-align: center;
}

.aside-content .type:hover {
  background-color: #1e90ff;
  color: white;
}

.edit-area {
  width: 900px;
  height: 760px;
  margin: 0 auto;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  overflow-y: scroll;
}

.edit-area::-webkit-scrollbar {
  display: none;
}

.title {
  border-bottom: 1px solid #eaeaea;
}

.first-line {
  border-bottom: 1px solid #eaeaea;
  height: 90px;
  font-size: 14px;
  color: #696969;
}

.first-line .number {
  height: 60px;
  line-height: 60px;
}

.add {
  text-align: left;
  display: none;
}

.first-line:hover .add {
  display: block;
}

.single-question:hover .add {
  display: block;
}

.add a {
  text-decoration: none;
  color: #1e90ff;
}

.add a:hover {
  color: #1682eb;
}

.title:hover {
  background-color: #fafafa;
}

.first-line:hover {
  background-color: #fafafa;
}

.sheet-name {
  margin: 0 0 30px 0;
  padding-top: 30px;
  height: 30px;
  line-height: 30px;
  font-size: 20px;
  font-weight: bold;
}

.sheet-description {
  text-align: left;
  margin: 0 50px 10px 50px;
  font-size: 14px;
  word-wrap: break-word;
}

.single-question {
  border-bottom: 1px solid #eaeaea;
  font-size: 14px;
  text-align: left;
}

.single-question:hover {
  background-color: #fafafa;
}

.single-question .question-content {
  padding: 30px 50px 0 50px;
  word-wrap: break-word;
}

.single-question .question-add {
  margin-top: 15px;
  height: 30px;
}

.question-add .add {
  margin-right: 10px;
}

.option >>> .el-radio,
.el-radio__input {
  white-space: normal;
}

.option,
.rate,
.pos,
.fill {
  margin: 10px 0;
}

.fill {
  width: 500px;
}

.option >>> .el-radio__input.is-disabled + span.el-radio__label {
  color: black;
}

.pos {
  text-align: center;
  height: 20px;
  width: 150px;
  line-height: 20px;
  background: linear-gradient(white, #dcdcdc);
  border: 1px solid #cdcdcd;
}
</style>
