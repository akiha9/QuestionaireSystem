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
                <div
                  :class="activeType === 0 ? 'actived' : ''"
                  @click="changeActiveType(0)"
                >
                  <i class="el-icon-document"></i>
                  全部问卷
                </div>
              </a>
              <a href="javascript:;">
                <div
                  :class="activeType === 1 ? 'actived' : ''"
                  @click="changeActiveType(1)"
                >
                  <i class="el-icon-star-on"></i>
                  星标问卷
                </div>
              </a>
              <a href="javascript:;">
                <div
                  :class="activeType === 2 ? 'actived' : ''"
                  @click="changeActiveType(2)"
                >
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
              <el-input
                placeholder="输入问卷名进行搜索..."
                class="input-with-select"
              >
                <el-button slot="append" icon="el-icon-search"></el-button>
              </el-input>
            </div>
            <div class="type-order fr">
              <el-dropdown @command="changeStatusType">
                <span class="el-dropdown-link">
                  <a href="javascript:;">{{ statusTypes[statusIndex] }}</a>
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
              <el-dropdown @command="changeOrderType">
                <span class="el-dropdown-link">
                  <a href="javascript:;">{{ orderTypes[orderIndex] }}</a>
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
          <div class="empty-list" v-if="sheetList.length === 0">
            当前分类下不存在问卷，快去创建吧
          </div>
          <div class="sheet-list" v-else>
            <div
              class="single-sheet"
              v-for="(sheet, index) in sheetList"
              :key="index"
            >
              <div class="sheet-content">
                <div class="sheet-header">
                  <div class="sheet-name fl">{{ sheet.name }}</div>
                  <div class="date fr">{{ sheet.createTime }}</div>
                  <div class="answer-num fr">答卷:{{ sheet.answerNum }}</div>
                  <div class="status fr">{{ sheet.status }}</div>
                  <div class="id fr">ID:{{ sheet._id }}</div>
                </div>
                <div class="sheet-op">
                  <div class="design fl">
                    <a href="javascript:;">
                      <router-link
                        v-if="sheet.statusIndex === 2"
                        :to="{ name: 'Edit', query: { id: sheet._id } }"
                        ><i class="el-icon-document"></i> 设计问卷
                      </router-link>
                      <router-link
                        v-else
                        :to="{ name: 'Preview', query: { id: sheet._id } }"
                        ><i class="el-icon-document"></i> 查看问卷
                      </router-link>
                    </a>
                  </div>
                  <div class="send fl" @click="copyURL(sheet)">
                    <a href="javascript:;">
                      <i class="el-icon-s-promotion"></i> 发送问卷
                    </a>
                  </div>
                  <div class="analysis fl">
                    <a href="javascript:;" @click="gotoAnalysis(sheet)">
                      <i class="el-icon-data-line"></i> 问卷分析
                    </a>
                  </div>
                  <div class="delete fr">
                    <a href="javascript:;" @click="clickDelete(sheet)">
                      <i class="el-icon-delete-solid"></i> 删除
                    </a>
                  </div>
                  <div class="copy fr">
                    <a href="javascript:;">
                      <i class="el-icon-document-copy"></i> 复制
                    </a>
                  </div>
                  <div class="release fr">
                    <a href="javascript:;" @click="releaseSheet(sheet)">
                      <i class="el-icon-s-promotion"></i> 发布
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="pagination">
            <el-pagination
              background
              layout="prev, pager, next"
              :current-page="currentPage"
              :page-size="pageSize"
              @current-change="handleCurrentChange"
              :total="total"
            ></el-pagination>
          </div>
        </div>
      </div>
      <div>
        <el-dialog
          title="创建问卷"
          :visible.sync="dialogFormVisible"
          :width="'40%'"
        >
          <el-form :model="form" :ref="form" :rules="rules">
            <el-form-item label="标题" prop="name">
              <el-input
                v-model="form.name"
                autocomplete="off"
                placeholder="请输入问卷名"
              ></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="createForm(form)"
              >确 定</el-button
            >
          </div>
        </el-dialog>
        <el-dialog title="删除问卷" :visible.sync="visible" :width="'40%'">
          <div>确认删除该问卷</div>
          <div slot="footer" class="dialog-footer">
            <el-button @click="cancelDelete">取 消</el-button>
            <el-button type="primary" @click="deleteSheet">确 定</el-button>
          </div>
        </el-dialog>
      </div>
      <div>
        <ReleaseForm
          :visible="releaseFormVisible"
          :sheetId="releaseId"
          @cancelRelease="cancelRelease"
        ></ReleaseForm>
      </div>
    </Header>
    <Footer></Footer>
  </div>
</template>

<script>
import Header from "@/components/layout/Header.vue";
import Footer from "@/components/layout/Footer.vue";
import ReleaseForm from "@/components/edit/ReleaseForm.vue";

export default {
  name: "Home",
  components: { Header, Footer, ReleaseForm },
  data() {
    let checkTitle = (rule, value, callback) => {
      if (!value || value.replace(/ /g, "") === "") {
        return callback(new Error("标题不能为空"));
      }
      setTimeout(() => {
        if (value.length > 30) {
          return callback(new Error("标题不能多于30个字符"));
        } else {
          callback();
        }
      });
    };

    return {
      activeType: 0,
      orderIndex: 0,
      statusIndex: 0,
      total: 0,
      currentPage: 1,
      pageSize: 4,
      dialogFormVisible: false,
      releaseFormVisible: false,
      releaseId: "",
      visible: false,
      deleteItem: {},
      orderTypes: ["时间倒序", "时间正序", "答卷倒序", "答卷正序"],
      statusTypes: ["状态", "已发布", "未发布"],
      sheetList: [],
      form: {
        name: "",
      },
      rules: {
        name: [{ required: false, validator: checkTitle, trigger: "blur" }],
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },

    getList() {
      this.$axios
        .get("/api/sheets", {
          params: {
            status: this.statusIndex,
            order: this.orderIndex,
            pageNumber: this.currentPage,
            numsPerPage: this.pageSize,
          },
        })
        .then((ret) => {
          if (ret.data.code === 200) {
            this.sheetList = ret.data.data.sheets;
            this.total = ret.data.data.total;
            this.sheetList.forEach((sheet) => {
              sheet.createTime = this.utils.Dater.formatDate(
                sheet.createTime,
                "yyyy-MM-dd hh:mm:ss"
              );
              sheet.releaseTime = this.utils.Dater.formatDate(
                sheet.releaseTime,
                "yyyy-MM-dd hh:mm:ss"
              );
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },

    clickDelete(sheet) {
      this.deleteItem = sheet;
      this.visible = true;
    },

    cancelDelete() {
      this.visible = false;
      this.deleteItem = {};
    },

    deleteSheet() {
      const id = this.deleteItem._id;
      this.$axios
        .get(`/api/sheets/${id}/delete`)
        .then((ret) => {
          this.$showMessage(ret.data);
          if (ret.data.code === 200) {
            this.visible = false;
            this.getList();
          }
        })
        .catch((err) => {
          console.log(err);
          this.$showMessage({ msg: err });
        });
    },

    handleCurrentChange(val) {
      this.currentPage = val;
      this.getList();
    },

    changeActiveType(type) {
      this.activeType = type;
    },

    changeStatusType(statusIndex) {
      if (this.statusIndex === statusIndex) {
        return;
      }
      this.statusIndex = statusIndex;
      this.currentPage = 1;
      this.getList();
    },

    changeOrderType(orderIndex) {
      if (this.orderIndex === orderIndex) {
        return;
      }
      this.orderIndex = orderIndex;
      this.currentPage = 1;
      this.getList();
    },

    createForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$axios
            .post("/api/sheets", {
              name: this.form.name,
            })
            .then((ret) => {
              this.$showMessage(ret.data);
              if (ret.data.code === 200) {
                this.dialogFormVisible = false;
                this.resetForm(formName);
                this.$router.push({
                  name: "Edit",
                  query: {
                    id: ret.data.data.sheet._id,
                  },
                });
              }
            })
            .catch((err) => {
              console.log(err);
              this.$showMessage({ msg: err });
            });
        }
      });
    },

    releaseSheet(sheet) {
      if (sheet.statusIndex === 1) {
        this.$showMessage({ code: 403, msg: "问卷已经发布" });
        return;
      }
      this.releaseId = sheet._id;
      this.releaseFormVisible = true;
    },

    cancelRelease() {
      this.releaseFormVisible = false;
      this.releaseId = "";
    },

    copyURL(sheet) {
      let URL =
        sheet.statusIndex === 1 ? `localhost:8080/answer?id=${sheet._id}` : ` `;
      this.$copyText(URL).then(
        (res) => {
          if (sheet.statusIndex === 1) {
            this.$showMessage({ code: 200, msg: "已将链接成功复制到剪贴板" });
          } else {
            this.$showMessage({ code: 403, msg: "问卷尚未发布" });
          }
        },
        (err) => {
          this.$showMessage({ code: 403, msg: "链接复制失败" });
        }
      );
    },

    gotoAnalysis(sheet) {
      if (sheet.statusIndex === 2) {
        this.$showMessage({ code: -1, msg: "问卷尚未发布" });
        return;
      }
      this.$router.push({
        name: "Analysis",
        query: {
          id: sheet._id,
        },
      });
    },
  },
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

.sheet-list,
.empty-list {
  height: 570px;
  margin-top: 20px;
}

.empty-list {
  color: #a9a9a9;
  font-size: 14px;
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

.sheet-name {
  width: 300px;
  height: 60px;
  text-align: left;
  text-overflow: ellipsis;
  -o-text-overflow: ellipsis;
  overflow: hidden;
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
