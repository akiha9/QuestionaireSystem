<template>
  <div>
    <div class="header clearfix">
      <div class="icon fl">
        <i class="el-icon-s-custom"></i>
      </div>
      <div class="name fl">问卷网</div>
      <div class="release fr">
        <el-button size="mini" type="primary" @click="release"
          >发布问卷</el-button
        >
      </div>
      <div class="home fr">
        <el-button
          v-if="this.type === 0"
          size="mini"
          type="primary"
          @click="preview"
          >预览问卷</el-button
        >
        <el-button
          v-if="this.type === 1"
          size="mini"
          type="primary"
          @click="backToEdit"
          >返回编辑</el-button
        >
      </div>
      <div class="user fr">
        <el-button
          v-if="this.type === 0"
          size="mini"
          type="primary"
          @click="save"
          >保存问卷</el-button
        >
      </div>
    </div>
    <div>
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: ["type"],
  methods: {
    release() {
      this.$emit("release");
    },

    preview() {
      this.$emit("preview");
    },

    save() {
      this.$emit("save");
    },

    backToEdit() {
      this.$emit("backToEdit");
    },
  },
};
</script>

<style scoped>
.header {
  height: 40px;
  line-height: 40px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  color: #696969;
  background-color: #f5f5f5;
  font-size: 14px;
}

.header div {
  padding-left: 10px;
}

.header a {
  text-decoration: none;
  color: #696969;
}

.header i {
  padding-left: 15px;
}

.header a:hover {
  color: #1e90ff;
}

.clearfix::after {
  content: "";
  display: block;
  height: 0;
  line-height: 0;
  clear: both;
  visibility: hidden;
}

.fl {
  float: left;
}

.fr {
  float: right;
}

.release {
  margin-right: 100px;
}
</style>
