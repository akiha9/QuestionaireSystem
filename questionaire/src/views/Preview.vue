<template>
  <div>
    <template v-if="!isRelease">
      <EditHeader :type="1" @backToEdit="backToEdit" @release="release">
        <div class="preview">
          <SheetView
            :type="0"
            :questionList="questionList"
            :sheet="sheet"
          ></SheetView>
          <ReleaseForm
            :sheetId="id"
            :visible="releaseFormVisible"
            @cancelRelease="cancelRelease"
          ></ReleaseForm>
        </div> </EditHeader
    ></template>
    <template v-else>
      <Header :type="1" @backToEdit="backToEdit" @release="release">
        <div class="preview">
          <SheetView
            :type="0"
            :questionList="questionList"
            :sheet="sheet"
          ></SheetView>
          <ReleaseForm
            :sheetId="id"
            :visible="releaseFormVisible"
            @cancelRelease="cancelRelease"
          ></ReleaseForm>
        </div> </Header
    ></template>
    <Footer> </Footer>
  </div>
</template>

<script>
import EditHeader from "@/components/layout/EditHeader.vue";
import Header from "@/components/layout/Header.vue";
import Footer from "@/components/layout/Footer.vue";
import SheetView from "@/components/answer/SheetView.vue";
import ReleaseForm from "@/components/edit/ReleaseForm.vue";

export default {
  components: {
    EditHeader,
    Footer,
    Header,
    SheetView,
    ReleaseForm,
  },
  data() {
    return {
      id: "",
      isRelease: false,
      sheet: {},
      releaseFormVisible: false,
      isOwner: false,
      questionList: [],
    };
  },

  created() {
    this.id = this.$route.query.id;
    this.getBasicInfo();
    this.getQuestionList();
  },

  methods: {
    backToEdit() {
      this.$router.push({
        name: "Edit",
        query: {
          id: this.id,
        },
      });
    },

    release() {
      this.releaseFormVisible = true;
    },

    cancelRelease() {
      this.releaseFormVisible = false;
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

    getBasicInfo() {
      this.$axios
        .get(`/api/sheets/${this.id}/info`)
        .then((ret) => {
          if (ret.data.code === 200) {
            this.sheet = ret.data.data.sheetInfo;
            this.isOwner = ret.data.data.isOwner;
            if (this.isOwner === false) {
              this.$router.replace("/");
              this.$showMessage({ msg: "没有访问权限" });
            }
            if (this.sheet.statusIndex === 1) {
              this.isRelease = true;
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
  },
};
</script>

<style scoped>
.preview {
  height: 780px;
  padding-top: 10px;
}
</style>
