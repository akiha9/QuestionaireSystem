<template>
  <div>
    <Header>
      <div class="answer">
        <template v-if="!isDone"
          ><SheetView
            :sheet="sheet"
            :questionList="questionList"
            :type="type"
            @submitAnswer="submitAnswer"
          ></SheetView
        ></template>
        <template v-else>
          <div class="notice">感谢您的配合，您已成功完成问卷填写！</div>
        </template>
      </div>
    </Header>
    <Footer> </Footer>
  </div>
</template>

<script>
import Header from "@/components/layout/Header.vue";
import Footer from "@/components/layout/Footer.vue";
import SheetView from "@/components/answer/SheetView.vue";

export default {
  name: "Answer",
  components: {
    Header,
    Footer,
    SheetView,
  },
  data() {
    return {
      id: "",
      type: 1,
      isDone: false,
      sheet: {},
      isOwner: false,
      questionList: [],
    };
  },

  created() {
    this.id = this.$route.query.id;
    this.getSheet();
  },

  methods: {
    getSheet() {
      this.$axios
        .get(`/api/sheets/${this.id}/all`)
        .then((ret) => {
          if (ret.data.code === 200) {
            this.sheet = ret.data.data.sheet;
            this.questionList = ret.data.data.questionList;
            if (this.sheet.statusIndex === 2) {
              this.$showMessage({ code: 403, msg: "问卷未发布" });
              this.$router.replace("/");
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

    submitAnswer(answerList) {
      this.$axios
        .post(`/api/sheets/${this.id}/answer`, {
          answerList: answerList,
        })
        .then((ret) => {
          this.$showMessage(ret.data);
          if (ret.data.code === 200) {
            this.isDone = true;
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
.answer {
  height: 780px;
}

.notice {
  margin-top: 200px;
}
</style>
