<template>
  <div>
    <Header>
      <div class="analysis">
        <div :style="{ 'padding-top': '10px' }"></div>
        <div class="edit-area">
          <div class="title">
            <div class="sheet-name">{{ sheet.name }}</div>
            <div class="sheet-description">
              {{ sheet.description }}
            </div>
          </div>
          <div class="first-line">
            <div class="container">
              <div>创建时间：{{ sheet.createTime }}</div>
              <div>发布时间：{{ sheet.releaseTime }}</div>
              <div>发布方式：{{ releaseType }}可填{{ sheet.limit }}次</div>
              <div>答卷数量：{{ sheet.answerNum }}</div>
            </div>
            <div class="add">
              <router-link
                v-if="sheet"
                :to="{ name: 'AllAnswer', params: { id: sheet._id } }"
                ><a href="javascript:;">查看所有答卷</a></router-link
              >
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
                <div class="add fl">
                  <router-link
                    :to="{
                      name: 'Single',
                      query: { questionId: question._id },
                      params: { id: id },
                    }"
                  >
                    <a href="javascript:;">查看这题的回答</a>
                  </router-link>
                </div>
              </div>
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
  components: {
    Header,
    Footer,
  },
  data() {
    return {
      id: "",
      tmp: "",
      releaseType: "",
      sheet: {},
      questionList: [],
    };
  },
  created() {
    this.id = this.$route.query.id;
    this.getSheetInfo();
    this.getQuestionList();
  },

  methods: {
    getSheetInfo() {
      this.$axios
        .get(`/api/sheets/${this.id}/info`)
        .then((ret) => {
          if (ret.data.code === 200) {
            this.sheet = ret.data.data.sheetInfo;
            this.sheet.createTime = this.utils.Dater.formatDate(
              this.sheet.createTime,
              "yyyy-MM-dd hh:mm:ss"
            );
            this.sheet.releaseTime = this.utils.Dater.formatDate(
              this.sheet.releaseTime,
              "yyyy-MM-dd hh:mm:ss"
            );
            this.isOwner = ret.data.data.isOwner;
            if (this.sheet.type === 0) {
              this.releaseType = "仅限注册用户，";
            } else if (this.sheet.type === 1) {
              this.releaseType = "仅限注册用户，每天";
            } else if (this.sheet.type === 2) {
              this.releaseType = "无需注册，";
            } else if (this.sheet.type === 3) {
              this.releaseType = "无需注册，每天";
            }
            if (this.isOwner === false) {
              this.$router.replace("/");
              this.$showMessage({ code: 403, msg: "没有访问权限" });
            }
            if (this.sheet.statusIndex === 2) {
              this.$router.replace("/");
              this.$showMessage({ code: 403, msg: "问卷尚未发布" });
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
          }
        })
        .catch((err) => {
          console.log(err);
          this.$showMessage({ msg: err });
        });
    },
  },
};
</script>

<style scoped>
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

.add {
  text-align: left;
  display: none;
}

.first-line:hover .add {
  display: block;
}

.edit-area::-webkit-scrollbar {
  display: none;
}

.title {
  border-bottom: 1px solid #eaeaea;
}

.first-line {
  text-align: left;
  height: 130px;
  border-bottom: 1px solid #eaeaea;
  font-size: 14px;
  color: #696969;
}

.first-line .add {
  margin-left: 50px;
}

.first-line .container {
  margin: 30px 0 10px 50px;
}

.container div {
  margin-bottom: 5px;
}

.add {
  text-align: left;
  display: none;
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
