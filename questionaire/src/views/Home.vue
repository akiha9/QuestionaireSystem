<template>
  <div>
    <Header>
      <div class="home">
        <div class="aside">
          <div class="aside-content">
            <a href="javascript:;" @click="dialogFormVisible = true">
              <div class="create">
                <i class="el-icon-plus"></i>
                <strong>创建问卷</strong>
              </div>
            </a>

            <div class="type">
              <a href="javascript:;">
                <div :class="activeType === 0 ? 'actived' : ''" @click="changeActiveType(0)">
                  <i class="el-icon-document"></i>
                  全部问卷
                </div>
              </a>
              <a href="javascript:;">
                <div :class="activeType === 1 ? 'actived' : ''" @click="changeActiveType(1)">
                  <i class="el-icon-star-on"></i>
                  星标问卷
                </div>
              </a>
              <a href="javascript:;">
                <div :class="activeType === 2 ? 'actived' : ''" @click="changeActiveType(2)">
                  <i class="el-icon-delete-solid"></i>
                  回收站
                </div>
              </a>
            </div>
          </div>
        </div>
        <div class="main">
          <div class="main-header">
            <div class="title fl">问卷列表</div>
            <div class="search fr">
              <el-input placeholder="输入问卷名进行搜索..." class="input-with-select">
                <el-button slot="append" icon="el-icon-search"></el-button>
              </el-input>
            </div>
            <div class="type-order fr">
              <el-dropdown @command="changeType">
                <span class="el-dropdown-link">
                  <a href="javascript:;">{{ types[typeIndex] }}</a>
                  <i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="0">状态</el-dropdown-item>
                  <el-dropdown-item command="1">已发布</el-dropdown-item>
                  <el-dropdown-item command="2">未发布</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
            <div class="time-order fr">
              <el-dropdown @command="changeTimeType">
                <span class="el-dropdown-link">
                  <a href="javascript:;">{{ timeTypes[timeIndex] }}</a>
                  <i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="0">时间倒序</el-dropdown-item>
                  <el-dropdown-item command="1">时间正序</el-dropdown-item>
                  <el-dropdown-item command="2">答卷倒序</el-dropdown-item>
                  <el-dropdown-item command="3">答卷正序</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </div>
          <div class="sheet-list">
            <div class="single-sheet" v-for="(sheet, index) in sheetList" :key="index">
              <div class="sheet-content">
                <div class="sheet-header">
                  <div class="sheet-name fl">{{ sheet.name }}</div>
                  <div class="date fr">{{ sheet.date }}</div>
                  <div class="answer-num fr">答卷:{{ sheet.answerNum }}</div>
                  <div class="status fr">{{ sheet.status }}</div>
                  <div class="id fr">ID:{{ sheet.id }}</div>
                </div>
                <div class="sheet-op">
                  <div class="design fl">
                    <a href="javascript:;">
                      <i class="el-icon-document"></i> 设计问卷
                    </a>
                  </div>
                  <div class="send fl">
                    <a href="javascript:;">
                      <i class="el-icon-s-promotion"></i> 发送问卷
                    </a>
                  </div>
                  <div class="analysis fl">
                    <a href="javascript:;">
                      <i class="el-icon-data-line"></i> 问卷分析
                    </a>
                  </div>
                  <div class="delete fr">
                    <a href="javascript:;">
                      <i class="el-icon-delete-solid"></i> 删除
                    </a>
                  </div>
                  <div class="copy fr">
                    <a href="javascript:;">
                      <i class="el-icon-document-copy"></i> 复制
                    </a>
                  </div>
                  <div class="release fr">
                    <a href="javascript:;">
                      <i class="el-icon-s-promotion"></i> 发布
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="pagination">
            <el-pagination background layout="prev, pager, next" :total="1000"></el-pagination>
          </div>
        </div>
      </div>
      <div>
        <el-dialog title="创建问卷" :visible.sync="dialogFormVisible" :width="'40%'">
          <el-form :model="form">
            <el-form-item>
              <el-input v-model="form.name" autocomplete="off" placeholder="请输入问卷名"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="createForm">确 定</el-button>
          </div>
        </el-dialog>
      </div>
    </Header>
    <Footer></Footer>
  </div>
</template>

<script>
import Header from "@/components/layout/Header.vue";
import Footer from "@/components/layout/Footer.vue";

export default {
  name: "Home",
  components: { Header, Footer },
  data() {
    return {
      activeType: 0,
      timeIndex: 0,
      typeIndex: 0,
      dialogFormVisible: false,
      timeTypes: ["时间倒序", "时间正序", "答卷倒序", "答卷正序"],
      types: ["状态", "已发布", "未发布"],
      sheetList: [
        {
          name: "问卷1",
          date: "2020-05-01",
          id: "77427855",
          status: "未发布",
          statusIndex: 2,
          answerNum: 0
        },
        {
          name: "问卷2",
          date: "2020-05-02",
          id: "77427856",
          status: "未发布",
          statusIndex: 2,
          answerNum: 0
        },
        {
          name: "问卷1",
          date: "2020-05-03",
          id: "77427857",
          status: "未发布",
          statusIndex: 2,
          answerNum: 0
        },
        {
          name: "问卷1",
          date: "2020-05-03",
          id: "77427857",
          status: "未发布",
          statusIndex: 2,
          answerNum: 0
        }
      ],
      form: {
        name: ""
      }
    };
  },
  methods: {
    changeActiveType(type) {
      this.activeType = type;
    },

    changeType(typeIndex) {
      this.typeIndex = typeIndex;
    },

    changeTimeType(timeIndex) {
      this.timeIndex = timeIndex;
    },

    createForm() {
      this.$router.replace("/edit");
    }
  }
};
</script>

<style scoped>
.home {
  height: 780px;
}

.aside {
  float: left;
  width: 300px;
}

.aside-content {
  margin: 15px;
}

.aside-content .create {
  font-size: 19px;
  height: 60px;
  line-height: 60px;
  margin-top: 20px;
  background-color: #1e90ff;
  color: white;
  border-radius: 4px;
}

a {
  text-decoration: none;
  color: #696969;
}

.aside-content .type {
  text-align: left;
  font-size: 17px;
  margin-top: 20px;
}

.type div {
  height: 50px;
  line-height: 50px;
  padding-left: 20px;
  border-bottom: 1px solid #f5f5f5;
}

.type div:hover {
  background-color: #f8f8f8;
}

.actived {
  font-weight: bold;
  background-color: #f5f5f5;
}

.main {
  margin-left: 300px;
}

.main-header {
  height: 60px;
  line-height: 60px;
  padding: 20px 40px 0px 50px;
}
.main-header a {
  text-decoration: none;
  color: #a9a9a9;
}

.main-header .title {
  font-size: 19px;
  font-weight: bold;
}

.type-order,
.time-order {
  font-size: 14px;
  color: #a9a9a9;
  padding-right: 20px;
}

.sheet-list {
  margin-top: 20px;
}

.single-sheet {
  margin: 0px 40px 15px 50px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  border-radius: 2px;
}

.sheet-content {
  margin: 0 25px 0 25px;
}

.sheet-header {
  height: 60px;
  line-height: 60px;
  border-bottom: 1px solid #f5f5f5;
  font-size: 14px;
}

.sheet-header .answer-num {
  width: 70px;
  text-align: left;
}

.sheet-header .date,
.answer-num,
.status,
.id {
  padding-left: 15px;
}

.sheet-op {
  height: 70px;
  line-height: 70px;
  font-size: 14px;
  color: #a9a9a9;
}

.sheet-op .fr {
  margin-left: 15px;
}

.sheet-op .fl {
  margin-right: 15px;
}

.pagination {
  text-align: right;
  margin: 30px 40px 0 0;
}
</style>
