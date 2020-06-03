const express = require("express");
const router = express.Router();
const userController = require("../controllers/user");
const sheetController = require("../controllers/sheet");
const answerController = require("../controllers/answer");
const { jwtAuth, jwtDecode } = require("../middleware/jwt");

router.use(jwtAuth);

// 获取用户信息
router.get("/users", userController.getOne);
// 用户注册
router.post("/users/regist", userController.create);
// 用户登录验证
router.post("/users/login", userController.verify);

// 用户获取所有问卷
router.get("/sheets", sheetController.all);
// 用户创建问卷
router.post("/sheets", sheetController.create);
// 用户获取问卷
router.get("/sheets/:id/all", jwtDecode, sheetController.getSheet);
// router.get("/sheets/:id/all", sheetController.getSheet);

// 用户获取问卷基本信息
router.get("/sheets/:id/info", sheetController.getBasicInfo);
// 用户更改问卷基本信息
router.put("/sheets/:id/info/update", sheetController.updateBasicInfo);
// 用户获取问卷的问题列表
router.get("/sheets/:id/list", sheetController.getQuestionList);
// 用户获取问卷中的一道题目
router.get("/sheets/single/:id", sheetController.getOneQuestion);
// 用户添加问卷问题
router.post("/sheets/:id/list", sheetController.createQuestion);
// 用户删除问卷问题
router.get(
  "/sheets/:id/list/:questionId/delete",
  sheetController.removeQuestion
);
// 用户更新问卷的问题列表
router.put("/sheets/:id/list", sheetController.updateQuestionList);
// 用户删除问卷
router.get("/sheets/:id/delete", sheetController.remove);
// 用户发布问卷
router.put("/sheets/:id/release", sheetController.release);

// 用户创建答卷
router.post("/sheets/:id/answer", jwtDecode, answerController.createMany);
// router.post("/sheets/:id/answer", answerController.createMany);
// 用户查看某一份答卷
router.get("/sheets/:id/answer", answerController.fetchByAnswerInfoId);
// 用户查看所有答案信息
router.get("/sheets/:id/answer/all", answerController.fetchAnswerInfoList);
// 用户查看某一问题的回答情况
router.get("/sheets/:id/answer/single", answerController.fetchByQuestionId);

// 全局错误处理
router.use((err, req, res, next) => {
  if (err && err.name === "UnauthorizedError") {
    res.json({
      code: 401,
      msg: "token过期或失效",
    });
  } else if (err) {
    res.status(err.httpStatusCode).json({ code: 500, msg: err.message });
  }
});

module.exports = router;
