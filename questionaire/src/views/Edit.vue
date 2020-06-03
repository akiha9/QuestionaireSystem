<template>
  <div>
    <EditHeader
      :type="0"
      @save="autoSave"
      @release="release"
      @preview="preview"
    >
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
              <div class="sheet-name">{{ sheet.name }}</div>
              <div class="sheet-description">
                {{
                  sheet.description === "" ? "添加问卷说明" : sheet.description
                }}
              </div>
            </div>
            <div class="first-line">
              <div class="number">[共 {{ this.questionList.length }} 题]</div>
              <div
                style="margin-left: 50px;"
                class="add"
                v-if="insertIndex !== 0"
                @click="insertIndex = 0"
              >
                <a href="javascript:;">在此题后插入新题</a>
              </div>
              <div
                style="margin-left: 50px;"
                class="add"
                v-else
                @click="insertIndex = ''"
              >
                <a href="javascript:;">取消插入点</a>
              </div>
            </div>
            <div
              class="single-question"
              v-for="(question, index) in questionList"
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
                  <div
                    class="fill"
                    v-for="(type, typeIndex) in question.typeList"
                    :key="typeIndex"
                  >
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
                    class="add fr"
                    v-if="question.type === 0"
                    @click="clickAddRelative(index)"
                  >
                    <a href="javascript:;">添加依赖</a>
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
          <el-dialog
            title="编辑标题"
            :visible.sync="changeTitleDialogVisible"
            :width="'40%'"
          >
            <el-form :model="form" :rules="titleRules" :ref="form">
              <el-form-item label="标题:" prop="sheetName">
                <el-input
                  v-model="form.sheetName"
                  autocomplete="off"
                  placeholder="请输入问卷标题"
                ></el-input>
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
              <el-button type="primary" @click="changeTitle(form)"
                >确 定</el-button
              >
            </div>
          </el-dialog>
        </div>
        <Form @submit="handleSubmit"></Form>
        <ReleaseForm
          @cancelRelease="releaseDialogVisible = false"
          :sheetId="id"
          :visible="releaseDialogVisible"
        ></ReleaseForm>
        <RelativeForm
          @cancelAddRelative="cancelAddRelative"
          @handleSubmit="handleSubmit"
          :visible="relativeDialogVisible"
          :questionList="questionList"
        ></RelativeForm>
      </div>
    </EditHeader>
    <Footer></Footer>
  </div>
</template>

<script>
import EditHeader from "@/components/layout/EditHeader.vue";
import ReleaseForm from "@/components/edit/ReleaseForm.vue";
import Footer from "@/components/layout/Footer.vue";
import Form from "@/components/edit/NewQuestionForm.vue";
import RelativeForm from "@/components/edit/RelativeForm.vue";
import _ from "lodash";

export default {
  name: "Edit",
  components: {
    EditHeader,
    ReleaseForm,
    RelativeForm,
    Footer,
    Form,
  },
  data() {
    let checkTitle = (rule, value, callback) => {
      if (!value || value.replace(/ /g, "") === "") {
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
      id: "",
      showSelect: false,
      showFill: false,
      showRate: false,
      showHigh: false,
      changeTitleDialogVisible: false,
      releaseDialogVisible: false,
      relativeDialogVisible: false,
      insertIndex: "",
      modifiedIndex: "",
      tmp: "",
      isOwner: false,
      sheet: {},
      questionList: [],
      relativeList: [],
      form: {
        sheetName: "",
        sheetDescription: "",
      },
      titleRules: {
        sheetName: [
          { required: false, validator: checkTitle, trigger: "blur" },
        ],
        sheetDescription: [
          { required: false, validator: checkDescription, trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.id = this.$route.query.id;
    this.getBasicInfo();
    this.getQuestionList();
  },

  methods: {
    autoSave() {
      this.$axios
        .put(`/api/sheets/${this.id}/list`, {
          updateList: this.questionList,
        })
        .then((ret) => {
          if (ret.data.code === 200) {
            this.$showMessage({ code: 200, msg: "保存成功" });
          }
        })
        .catch((err) => {
          console.log(err);
          this.$showMessage({ msg: err });
        });
    },

    preview() {
      this.$router.push({
        name: "Preview",
        query: {
          id: this.id,
        },
      });
    },

    release() {
      this.releaseDialogVisible = true;
    },

    getBasicInfo() {
      this.$axios
        .get(`/api/sheets/${this.id}/info`)
        .then((ret) => {
          if (ret.data.code === 200) {
            this.sheet = ret.data.data.sheetInfo;
            this.isOwner = ret.data.data.isOwner;
            if (this.isOwner === false) {
              this.$router.replace("/");
              this.$showMessage({ code: 403, msg: "没有访问权限" });
            }
            if (this.sheet.statusIndex === 1) {
              this.$router.replace("/");
              this.$showMessage({ code: 403, msg: "问卷已经发布" });
            }
          } else {
            this.$showMessage(ret.data);
            this.$router.replace("/");
          }
        })
        .catch((err) => {
          console.log(err);
          this.$showMessage({ msg: err });
          this.$router.replace("/");
        });
    },

    getQuestionList() {
      this.$axios
        .get(`/api/sheets/${this.id}/list`)
        .then((ret) => {
          if (ret.data.code === 200) {
            this.questionList = ret.data.data.questionList;
            this.constructRelativeList();
          }
        })
        .catch((err) => {
          console.log(err);
          this.$showMessage({ msg: err });
        });
    },

    constructRelativeList() {
      this.relativeList = [];
      this.questionList.forEach((question, questionIndex) => {
        question.relative.forEach((relatives) => {
          relatives.forEach((relative) => {
            if (this.relativeList.indexOf(questionIndex) === -1) {
              this.relativeList.push(questionIndex);
            }
            if (this.relativeList.indexOf(relative === -1)) {
              this.relativeList.push(relative);
            }
          });
        });
      });
    },

    resetForm(formName) {
      this.$refs[formName].resetFields();
    },

    // 调整index
    resetIndex(list) {
      list.forEach((question, index) => {
        question.index = index;
      });
    },

    changeTitle(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$axios
            .put(`/api/sheets/${this.id}/info/update`, {
              name: this.form.sheetName,
              description: this.form.sheetDescription,
            })
            .then((ret) => {
              if (ret.data.code === 200) {
                this.getBasicInfo();
                this.changeTitleDialogVisible = false;
                this.resetForm(formName);
              }
            })
            .catch((err) => {
              console.log(err);
              this.$showMessage({ msg: err });
            });
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
        form: this.questionList[index],
      });
      this.$store.commit("switchVisibility");
    },

    clickAddRelative(index) {
      this.modifiedIndex = index;
      this.$store.commit("changeForm", {
        form: this.questionList[index],
      });
      this.$store.commit("initRelative");
      this.relativeDialogVisible = true;
    },

    // 删除，需要调整其他index，先调整index确保数据库中的index是正确的
    deleteQuestion(index) {
      if (this.relativeList.indexOf(index) !== -1) {
        this.$showMessage({ code: -1, msg: "题目间存在依赖关系" });
        return;
      }
      const deleteId = this.questionList[index]._id;
      const updateList = _.cloneDeep(this.questionList);
      updateList.splice(index, 1);
      this.resetIndex(updateList);

      this.$axios
        .put(`/api/sheets/${this.id}/list`, { updateList: updateList })
        .then((ret) => {
          if (ret.data.code === 200) {
            this.$axios
              .get(`/api/sheets/${this.id}/list/${deleteId}/delete`)
              .then((ret) => {
                this.$showMessage(ret.data);
                if (ret.data.code === 200) {
                  this.getQuestionList();
                }
              })
              .catch((err) => {
                console.log(err);
                this.$showMessage({ msg: err });
              });
          }
        })
        .catch((err) => {
          console.log(err);
          this.$showMessage({ msg: err });
        });
    },

    moveUp(index) {
      if (index === 0) {
        return;
      } else {
        if (
          this.relativeList.indexOf(index) !== -1 ||
          this.relativeList.indexOf(index - 1) !== -1
        ) {
          this.$showMessage({ code: -1, msg: "题目间存在依赖关系" });
          return;
        }
        let tmp = this.questionList[index];
        let list = this.questionList;
        this.$set(list, index, list[index - 1]);
        this.$set(list, index - 1, tmp);
        list[index].index++;
        list[index - 1].index--;
      }
    },

    moveDown(index) {
      if (index === this.questionList.length - 1) {
        return;
      } else {
        if (
          this.relativeList.indexOf(index) !== -1 ||
          this.relativeList.indexOf(index + 1) !== -1
        ) {
          this.$showMessage({ code: -1, msg: "题目间存在依赖关系" });
          return;
        }
        let tmp = this.questionList[index];
        let list = this.questionList;
        this.$set(list, index, list[index + 1]);
        this.$set(list, index + 1, tmp);
        list[index].index--;
        list[index + 1].index++;
      }
    },

    handleSubmit() {
      let newQuestion = _.cloneDeep(this.$store.state.form);
      let updateList = [];
      newQuestion.sheet = this.id;
      this.$store.commit("clearForm");

      // 插入到最后，只需要提交新的
      if (this.insertIndex === "" && this.modifiedIndex === "") {
        newQuestion.index = this.questionList.length;
        this.$axios
          .post(`/api/sheets/${this.id}/list`, newQuestion)
          .then((ret) => {
            this.$showMessage(ret.data);
            if (ret.data.code === 200) {
              this.getQuestionList();
            }
          })
          .catch((err) => {
            this.$showMessage({ msg: err });
            console.log(err);
          });
      }
      // 更改，不需要对其他题目的index进行更新
      else if (this.modifiedIndex !== "") {
        updateList.push(newQuestion);
        this.$axios
          .put(`/api/sheets/${this.id}/list`, {
            updateList: updateList,
          })
          .then((ret) => {
            if (ret.data.code === 200) {
              this.getQuestionList();
            }
          })
          .catch((err) => {
            this.$showMessage({ msg: err });
            console.log(err);
          });
        this.modifiedIndex = "";
      }
      // 插入到中间，需要对其他题目的index进行更新
      else {
        const updateList = _.cloneDeep(this.questionList);
        updateList.splice(this.insertIndex, 0, newQuestion);
        this.resetIndex(updateList);
        updateList.splice(this.insertIndex, 1);

        this.$axios
          .put(`/api/sheets/${this.id}/list`, { updateList: updateList })
          .then((ret) => {
            if (ret.data.code === 200) {
              this.$axios
                .post(`/api/sheets/${this.id}/list`, newQuestion)
                .then((ret) => {
                  this.$showMessage(ret.data);
                  if (ret.data.code === 200) {
                    this.getQuestionList();
                  }
                })
                .catch((err) => {
                  this.$showMessage({ msg: err });
                  console.log(err);
                });
            }
          })
          .catch((err) => {
            console.log(err);
            this.$showMessage({ msg: err });
          });
      }
    },

    cancelAddRelative() {
      this.relativeDialogVisible = false;
    },
  },
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
