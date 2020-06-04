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
            </div>
          </div>
          <div class="info-container">
            <div class="question-info">
              <div class="sum">回答人数：{{ answerList.length }}</div>
              <div
                class="option-sum"
                v-if="question.type === 0 || question.type === 1"
              >
                <div
                  v-for="(option, index) in question.optionList"
                  :key="index"
                  class="single-option"
                >
                  <div class="option-content fl">
                    <div>选项{{ index + 1 }}：{{ option }}</div>
                  </div>
                  <div class="option-num fl">
                    数量：{{ numsPerOption[index] }}
                  </div>
                </div>
              </div>
              <div
                class="fill-analysis"
                v-else-if="
                  (question.type === 2 || question.type === 3) &&
                    analysis.length !== 0
                "
              >
                <div v-for="(types, index) in question.typeList" :key="index">
                  <template v-if="types[0] === 0 || types[0] === 1">
                    <div class="rate-container">
                      填空{{ index + 1 }}（{{
                        types[0] === 0 ? "整数" : "小数"
                      }}）：
                    </div>
                    <div class="rate-container">
                      <div class="min fl">
                        最小值：{{
                          types[0] === 0
                            ? analysis[index][0]
                            : analysis[index][0].toFixed(2)
                        }}
                      </div>
                      <div class="max fl">
                        最大值：{{
                          types[0] === 0
                            ? analysis[index][1]
                            : analysis[index][1].toFixed(2)
                        }}
                      </div>
                      <div class="avg fl">
                        平均值：{{ analysis[index][2].toFixed(2) }}
                      </div>
                    </div>
                    <div class="rate-container">
                      总和：{{
                        types[0] === 0
                          ? analysis[index][3]
                          : analysis[index][3].toFixed(2)
                      }}
                    </div>
                  </template>
                </div>
              </div>
              <div class="rate-analysis" v-else-if="question.type === 4">
                <div class="rate-container">
                  <div class="high fl">最高评分：{{ rates[0] }}</div>
                  <div class="low fl">最低评分：{{ rates[1] }}</div>
                  <div class="avg fl">平均评分：{{ rates[2].toFixed(1) }}</div>
                </div>
                <div
                  class="rate-container"
                  v-for="(rate, index) in [1, 2, 3, 4, 5]"
                  :key="index"
                >
                  <div class="rate fl">评分：{{ rate }}</div>
                  <div class="rate fl">人数：{{ rateNums[index] }}</div>
                </div>
              </div>
            </div>
          </div>
          <div
            class="chart-container"
            v-if="
              question.type === 0 || question.type === 1 || question.type === 4
            "
          >
            <div id="chart"></div>
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
  components: {
    Header,
    Footer,
  },
  data() {
    return {
      id: "",
      questionId: "",
      tmp: "",
      question: {},
      answerList: [],
      numsPerOption: [],
      analysis: [],
      rates: [0, 0, 0],
      rateNums: [0, 0, 0, 0, 0],
      answerNum: 0,
    };
  },
  created() {
    this.id = this.$route.params.id;
    this.questionId = this.$route.query.questionId;
    this.getQuestionInfo();
    this.getAnswerList();
  },

  mounted() {},

  methods: {
    getQuestionInfo() {
      this.$axios
        .get(`/api/sheets/single/${this.questionId}`)
        .then((ret) => {
          if (ret.data.code === 200) {
            this.question = ret.data.data.question;
          }
        })
        .catch((err) => {
          console.log(err);
          this.$showMessage({ msg: err });
        });
    },

    getAnswerList() {
      this.$axios
        .get(`/api/sheets/${this.id}/answer/single`, {
          params: { questionId: this.questionId },
        })
        .then((ret) => {
          if (ret.data.code === 200) {
            this.answerList = ret.data.data.answers;
            if (this.question.type === 0 || this.question.type === 1) {
              this.build();
              this.draw();
            } else if (this.question.type === 2 || this.question.type === 3) {
              this.calculate();
            } else if (this.question.type === 4) {
              this.rate();
              this.draw();
            }
          }
        })
        .catch((err) => {
          console.log(err);
          this.$showMessage({ msg: err });
        });
    },

    build() {
      this.numsPerOption = [];
      this.question.optionList.forEach((option) => {
        this.numsPerOption.push(0);
      });

      this.answerList.forEach((answer) => {
        answer.answer.forEach((ans) => {
          this.question.optionList.forEach((option, index) => {
            if (ans == option) {
              this.numsPerOption[index]++;
            }
          });
        });
      });
    },

    draw() {
      let list = [];
      let names = [];
      if (this.question.type === 0 || this.question.type === 1) {
        this.numsPerOption.forEach((num, index) => {
          let obj = {};
          obj.name = this.question.optionList[index];
          obj.value = num;
          list.push(obj);
        });
        names = this.question.optionList;
      } else if (this.question.type === 4) {
        this.rateNums.forEach((num, index) => {
          let obj = {};
          obj.name = index + 1;
          obj.value = num;

          list.push(obj);
        });
        names = ["1", "2", "3", "4", "5"];
      }

      let chart = this.$echarts.init(document.getElementById("chart"));
      chart.setOption({
        series: [
          {
            type: "pie",
            radius: "70%",
            hoverAnimation: false, // 是否开启 hover 在扇区上的放大动画效果
            data: list,
          },
        ],

        legend: {
          y: "bottom",
          x: "center",
          data: names,
        },
      });
    },

    rate() {
      let rates = [];
      let [min, max, sum] = [100, -1, 0];
      this.answerList.forEach((answer) => {
        let rate = answer.answer[0];
        if (min > rate) {
          min = rate;
        }
        if (rate > max) {
          max = rate;
        }
        sum += rate;
        this.rateNums[rate - 1]++;
      });
      let avg = sum / this.answerList.length;
      rates.push(max, min, avg);
      this.rates = rates;
    },

    calculate() {
      this.question.typeList.forEach((types, index) => {
        if (types[0] === 0 || types[0] === 1) {
          let [min, max, avg, sum] = [types[2] + 1, types[1] - 1, 0, 0];
          this.answerList.forEach((answer) => {
            let ans = answer.answer[index];
            if (min > ans) {
              min = ans;
            }
            if (max < ans) {
              max = ans;
            }
            sum += ans;
          });
          avg = sum / this.answerList.length;
          this.analysis.push([max, min, avg, sum]);
        } else {
          this.analysis.push([]);
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

#chart {
  height: 300px;
  width: 300px;
  margin: 0 auto;
}

.rate-container {
  height: 30px;
  line-height: 30px;
}
.question-info .high,
.low,
.avg,
.sum {
  width: 250px;
}

.question-info .rate {
  width: 250px;
  margin: 0;
}

.fill-analysis .min,
.max,
.avg {
  width: 250px;
}
</style>
