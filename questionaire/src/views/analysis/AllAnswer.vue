<template>
  <div>
    <Header>
      <div class="analysis">
        <div :style="{ 'padding-top': '10px' }"></div>
        <div class="edit-area">
          <div
            class="single-question"
            v-for="(answer, index) in answerInfoList"
            :key="index"
          >
            <div class="question-content">
              <div class="container">
                <div>
                  用户ID：{{ answer.userId ? answer.userId : "匿名用户" }}
                </div>
                <div>用户IP：{{ answer.userIp }}</div>
                <div>提交时间：{{ answer.submitTime }}</div>
              </div>
              <div class="question-add">
                <div class="add fl">
                  <router-link
                    :to="{
                      name: 'SingleAnswer',
                      params: { id: id },
                      query: { answerId: answer._id },
                    }"
                  >
                    <a href="javascript:;">查看这份答卷</a>
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
      answerInfoList: [],
    };
  },
  created() {
    this.id = this.$route.params.id;
    this.getAnswerInfoList();
  },

  methods: {
    getAnswerInfoList() {
      this.$axios
        .get(`/api/sheets/${this.id}/answer/all`)
        .then((ret) => {
          if (ret.data.code === 200) {
            this.answerInfoList = ret.data.data.answerInfoList;
            this.answerInfoList.forEach((answer) => {
              answer.submitTime = this.utils.Dater.formatDate(
                answer.submitTime,
                "yyyy-MM-dd hh:mm:ss"
              );
            });
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

.container div {
  margin-bottom: 5px;
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
