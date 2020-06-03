<template>
  <div>
    <Header>
      <div class="analysis">
        <div :style="{ 'padding-top': '10px' }"></div>
        <div class="edit-area">
          <div class="single-question">
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
            </div>
          </div>
          <div class="info-container">
            <div class="question-info">
              <div class="sum">回答人数：{{ answerList.length }}</div>
              <div class="option-sum" v-if="question.type === 0 || question.type === 1">
                <div
                  v-for="(option, index) in question.optionList"
                  :key="index"
                  class="single-option"
                >
                  <div class="option-content fl">
                    <div>选项{{index+1}}：{{option}}</div>
                  </div>
                  <div class="option-num fl">数量：{{ numsPerOption[index] }}</div>
                </div>
              </div>
              <div class="fill-analysis" v-if="question.type === 2 || question.type === 3">
                <div></div>
              </div>
            </div>
          </div>

          <div></div>
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
  components: {
    Header,
    Footer
  },
  data() {
    return {
      id: "",
      questionId: "",
      tmp: "",
      question: {},
      answerList: [],
      numsPerOption: [],
      answerNum: 0
    };
  },
  created() {
    this.id = this.$route.params.id;
    this.questionId = this.$route.query.questionId;
    this.getQuestionInfo();
    this.getAnswerList();
  },

  methods: {
    getQuestionInfo() {
      this.$axios
        .get(`/api/sheets/single/${this.questionId}`)
        .then(ret => {
          if (ret.data.code === 200) {
            this.question = ret.data.data.question;
          }
        })
        .catch(err => {
          console.log(err);
          this.$showMessage({ msg: err });
        });
    },

    getAnswerList() {
      this.$axios
        .get(`/api/sheets/${this.id}/answer/single`, {
          params: { questionId: this.questionId }
        })
        .then(ret => {
          if (ret.data.code === 200) {
            this.answerList = ret.data.data.answers;
            if (this.question.type === 0 || this.question.type === 1) {
              this.build();
            }
          }
        })
        .catch(err => {
          console.log(err);
          this.$showMessage({ msg: err });
        });
    },

    build() {
      this.numsPerOption = [];
      this.question.optionList.forEach(option => {
        this.numsPerOption.push(0);
      });

      this.answerList.forEach(answer => {
        answer.answer.forEach(ans => {
          this.question.optionList.forEach((option, index) => {
            if (ans == option) {
              this.numsPerOption[index]++;
            }
          });
        });
      });
    }
  }
};
</script>

<style scoped>
.fl {
  float: left;
}

.analysis {
  height: 780px;
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

.single-question {
  border-bottom: 1px solid #eaeaea;
  font-size: 14px;
  text-align: left;
}

.single-question:hover {
  background-color: #fafafa;
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

.info-container {
  border-bottom: 1px solid #eaeaea;
}

.question-info {
  font-size: 14px;
  text-align: left;
  margin: 30px 50px 20px 50px;
}

.question-info .sum {
  margin-bottom: 10px;
}

.single-option {
  height: 30px;
  line-height: 30px;
}

.option-content {
  margin-right: 10px;
}

.option-content div {
  width: 400px;
  height: 30px;
  overflow: hidden;
  white-space: nowrap;
}
</style>
