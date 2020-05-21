<template>
  <div>
    <div class="header clearfix">
      <div class="icon fl">
        <i class="el-icon-s-custom"></i>
      </div>
      <div class="name fl">问卷网</div>
      <div class="user fr">
        <el-dropdown>
          <span class="el-dropdown-link">
            akiha
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item icon="el-icon-user">用户信息</el-dropdown-item>
            <el-dropdown-item icon="el-icon-phone">客服中心</el-dropdown-item>
            <el-dropdown-item icon="el-icon-switch-button">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <div class="home fr">
        <a href="javascript:;">我的问卷</a>
      </div>
      <div class="home-icon fr">
        <i class="el-icon-s-home"></i>
      </div>
    </div>
    <div>
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {};
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

.header .user {
  padding-right: 50px;
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

.user {
  padding-right: 25px;
}
</style>