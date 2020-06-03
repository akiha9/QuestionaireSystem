<template>
  <div>
    <div class="edit-area">
      <div class="title" @click="changeTitleDialogVisible = true">
        <div class="sheet-name">{{ sheet.name }}</div>
        <div class="sheet-description">
          {{ sheet.description === "" ? "" : sheet.description }}
        </div>
      </div>
      <div v-for="(question, index) in questionList" :key="index">
        <div class="single-question" v-if="visible(index)">
          <div class="question-content">
            <div class="question-title">
              <font color="red">*</font>
              <strong>
                {{ question.content }}
                <template v-if="question.type === 1">(多选)</template>
              </strong>
            </div>
            <template v-if="question.type === 0">
              <el-radio-group
                v-model="answerList[index].answer[0]"
                :disabled="type === 2"
              >
                <div
                  class="option"
                  v-for="(option, optionIndex) in question.optionList"
                  :key="optionIndex"
                >
                  <el-radio :label="option">{{ option }}</el-radio>
                </div>
              </el-radio-group>
            </template>
            <template v-if="question.type === 1"
              ><div
                class="option"
                v-for="(option, optionIndex) in question.optionList"
                :key="optionIndex"
              >
                <el-radio
                  v-model="answerList[index].answer[optionIndex]"
                  :label="option"
                  @click.native.prevent="
                    switchSelected(index, optionIndex, option)
                  "
                  :disabled="type === 2"
                  >{{ option }}</el-radio
                >
              </div></template
            >
            <template v-if="question.type === 2 || question.type === 3">
              <div
                class="fill"
                v-for="(types, typeIndex) in question.typeList"
                :key="typeIndex"
              >
                <el-input
                  v-if="types[0] === 2 || types[0] === 3"
                  size="small"
                  type="textarea"
                  :rows="types[0] === 2 ? 1 : 3"
                  v-model="answerList[index].answer[typeIndex]"
                  :disabled="type === 2"
                ></el-input>
                <el-input-number
                  v-if="types[0] === 0"
                  size="small"
                  :min="types[1]"
                  :max="types[2]"
                  v-model="answerList[index].answer[typeIndex]"
                  :disabled="type === 2"
                ></el-input-number>
                <el-input-number
                  v-if="types[0] === 1"
                  size="small"
                  :precision="2"
                  :min="types[1]"
                  :max="types[2]"
                  v-model="answerList[index].answer[typeIndex]"
                  :disabled="type === 2"
                ></el-input-number>
              </div>
            </template>
            <template v-if="question.type === 4">
              <div class="rate">
                <el-rate
                  v-model="answerList[index].answer[0]"
                  :disabled="type === 2"
                ></el-rate>
              </div>
            </template>
            <template v-if="question.type === 5">
              <div
                class="get-position"
                @click="getPos(index)"
                v-if="answerList[index].answer[0] === ''"
              >
                <a href="javascript:;">
                  <i class="el-icon-position"></i> 点击获取地理位置
                </a>
              </div>
              <div class="position" v-else>
                {{ answerList[index].answer[0] }}
              </div>
            </template>
          </div>
        </div>
      </div>
      <div class="submit-button">
        <div class="alert">
          <el-alert
            v-if="alertVisible && type === 0"
            title="问卷的创建者提交问卷无效"
            type="error"
          >
          </el-alert>
          <el-alert
            v-if="alertVisible && type === 1"
            title="请完成问卷全部问题"
            type="error"
          >
          </el-alert>
        </div>
        <el-button v-if="type !== 2" type="primary" @click="submitSheet"
          >提交问卷</el-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import MapLoader from "@/assets/AMap/AMap.js";

export default {
  props: ["questionList", "sheet", "type", "answer"],
  data() {
    return {
      alertVisible: false,
      questionVisible: [],
      answerList: [],
    };
  },
  watch: {
    questionList(curVal, oldVal) {
      this.questionVisible = [];
      curVal.forEach((question) => {
        this.questionVisible.push([]);

        let ans = [];
        if (question.type === 1) {
          question.optionList.forEach((type) => {
            ans.push("");
          });
        } else if (question.type === 2 || question.type === 3) {
          question.typeList.forEach((type) => {
            if (type[0] === 0 || type[0] === 1) {
              ans.push(type[1]);
            } else {
              ans.push("");
            }
          });
        } else if (question.type === 4) {
          ans.push(0);
        } else {
          ans.push("");
        }
        this.answerList.push({
          questionId: question._id,
          answer: ans,
          questionType: question.type,
        });
      });

      curVal.forEach((question, questionIndex) => {
        question.relative.forEach((relatives, optionIndex) => {
          relatives.forEach((relative) => {
            this.questionVisible[relative].push([questionIndex, optionIndex]);
          });
        });
      });
    },

    answer(curVal, oldVal) {
      if (curVal === undefined || curVal === []) {
        return;
      }
      this.answerList = this.answer;
    },
  },

  computed: {
    // 注意判断时需要递归判断多层级联
    visible() {
      return (index) => {
        if (this.questionVisible[index].length === 0) {
          return true;
        } else {
          let ret = false;
          this.questionVisible[index].forEach((relative) => {
            let [questionIndex, optionIndex] = [relative[0], relative[1]];
            if (
              this.answerList[questionIndex].answer[0] ===
                this.questionList[questionIndex].optionList[optionIndex] &&
              this.visible(questionIndex)
            ) {
              ret = true;
            }
          });
          return ret;
        }
      };
    },
  },

  methods: {
    submitSheet() {
      if (this.type === 0 || this.sheetComplete() === false) {
        this.alertVisible = true;
      } else {
        this.alertVisible = false;
        let answerList = [];
        this.answerList.forEach((answer, index) => {
          if (this.visible(index)) {
            answerList.push(answer);
          }
        });
        this.$emit("submitAnswer", answerList);
      }
    },

    getPos(index) {
      MapLoader().then((AMap) => {
        AMap.plugin("AMap.CitySearch", () => {
          let citySearch = new AMap.CitySearch();
          citySearch.getLocalCity((status, res) => {
            if (status === "complete" && res.info === "OK") {
              this.$set(
                this.answerList[index].answer,
                0,
                res.province + res.city
              );
            }
          });
        });
      });
    },

    switchSelected(questionIndex, optionIndex, option) {
      if (this.answerList[questionIndex].answer[optionIndex] === "") {
        this.$set(this.answerList[questionIndex].answer, optionIndex, option);
      } else {
        this.$set(this.answerList[questionIndex].answer, optionIndex, "");
      }
    },

    sheetComplete() {
      let complete = true;
      this.answerList.forEach((question, questionIndex) => {
        if (this.visible(questionIndex)) {
          if (question.questionType === 1) {
            let tmp = false;
            question.answer.forEach((ans) => {
              if (ans !== "") {
                tmp = true;
              }
            });
            if (!tmp) {
              complete = false;
            }
          } else {
            question.answer.forEach((ans) => {
              if (ans === "") {
                complete = false;
              }
            });
          }
        }
      });
      return complete;
    },
  },
};
</script>

<style scoped>
a {
  text-decoration: none;
  color: #333;
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

.single-question .question-content {
  padding: 30px 50px 20px 50px;
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

.get-position {
  margin: 10px 0;
  text-align: center;
  height: 20px;
  width: 150px;
  line-height: 20px;
  background: linear-gradient(white, #dcdcdc);
  border: 1px solid #cdcdcd;
}

.position {
  margin: 10px 0;
}

.submit-button {
  text-align: center;
  margin: 20px 0;
}
.alert {
  width: 220px;
  margin: 0 auto;
  padding-bottom: 10px;
}
</style>
