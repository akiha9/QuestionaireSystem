<template>
  <div>
    <template>
      <Header>
        <div class="preview">
          <SheetView
            :type="2"
            :questionList="questionList"
            :sheet="sheet"
            :answer="answerList"
          ></SheetView>
        </div> </Header
    ></template>
    <Footer> </Footer>
  </div>
</template>

<script>
import Header from "@/components/layout/Header.vue";
import Footer from "@/components/layout/Footer.vue";
import SheetView from "@/components/answer/SheetView.vue";

export default {
  components: {
    Footer,
    Header,
    SheetView,
  },
  data() {
    return {
      id: "",
      answerId: "",
      isRelease: false,
      sheet: {},
      releaseFormVisible: false,
      isOwner: false,
      questionList: [],
      answerList: [],
      count: 1,
    };
  },

  created() {
    this.id = this.$route.params.id;
    this.answerId = this.$route.query.answerId;
    this.getQuestionList();
    this.getBasicInfo();
    this.getAnswer();
  },

  methods: {
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

    getBasicInfo() {
      this.$axios
        .get(`/api/sheets/${this.id}/info`)
        .then((ret) => {
          if (ret.data.code === 200) {
            this.sheet = ret.data.data.sheetInfo;
            this.isOwner = ret.data.data.isOwner;
            if (this.isOwner === false || this.sheet.statusIndex === 2) {
              this.$router.replace("/");
              this.$showMessage({ msg: "没有访问权限" });
            }
          } else {
            this.$showMessage(ret.data);
          }
        })
        .catch((err) => {
          console.log(err);
          this.$showMessage({ msg: err });
        });
    },

    getAnswer() {
      this.$axios
        .get(`/api/sheets/${this.id}/answer`, {
          params: { answerId: this.answerId },
        })
        .then((ret) => {
          if (ret.data.code === 200) {
            this.answerList = ret.data.data.answerList;
            this.sortAnswer();
          }
        })
        .catch((err) => {
          console.log(err);
          this.$showMessage({ msg: err });
          this.$router.replace("/");
        });
    },

    sortAnswer() {
      let newList = [];
      this.questionList.forEach((question, questionIndex) => {
        let find = false;
        this.answerList.forEach((answer) => {
          if (question._id == answer.questionId) {
            newList.push(answer);
            find = true;
          }
        });
        if (!find) {
          newList.push([]);
        }
      });
      this.answerList = newList;
    },
  },
};
</script>

<style scoped>
.preview {
  height: 780px;
  padding-top: 10px;
}
</style>
