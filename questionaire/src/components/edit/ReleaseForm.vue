<template>
  <div class="release-form">
    <el-dialog
      title="发布问卷"
      :visible.sync="visible"
      width="40%"
      center
      :before-close="cancelRelease"
    >
      <div class="note">请选择问卷发布方式，问卷一旦发布不能修改</div>
      <el-radio-group v-model="releaseType">
        <div v-for="(type, index) in releaseTypes" :key="index" class="type">
          <el-radio :label="index">{{ type }}</el-radio>
        </div>
      </el-radio-group>
      <div class="limit">
        填写次数限制，<template v-if="releaseType === 1 || releaseType === 3"
          >每天</template
        >至多
        <el-input-number
          :min="1"
          v-model="limit"
          size="mini"
          width="20px"
        ></el-input-number>
        次
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelRelease">取 消</el-button>
        <el-button type="primary" @click="release">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: ["sheetId", "visible"],
  data() {
    return {
      releaseType: 0,
      releaseTypes: [
        "仅限注册用户",
        "仅限注册用户，每天可填",
        "无需注册",
        "无需注册，每天可填",
      ],
      limit: 1,
    };
  },

  methods: {
    cancelRelease() {
      this.$emit("cancelRelease");
    },

    release() {
      this.$axios
        .put(`/api/sheets/${this.sheetId}/release`, {
          type: this.releaseType,
          limit: this.limit,
        })
        .then((ret) => {
          if (ret.data.code === 200) {
            this.$showMessage(ret.data);
            this.$emit("cancelRelease");
            if (this.$route.path == "/") {
              location.reload();
            } else {
              this.$router.replace("/");
            }
          }
        })
        .catch((err) => {
          this.$showMessage({ msg: err });
          console.log(err);
        });
    },
  },
};
</script>

<style scoped>
.note {
  margin-bottom: 10px;
}

.type {
  margin: 0 0 5px 10px;
}

.limit {
  margin-top: 20px;
}

.limit >>> .el-input-number--mini {
  width: 100px;
}
</style>
