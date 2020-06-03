const Model = require("../model");
const { Sheet, Question } = Model;

const sheetController = {
  // 用户获取自己的全部问卷
  async all(req, res) {
    const [status, order] = [req.query.status, req.query.order];
    const [pageNumber, numsPerPage] = [
      req.query.pageNumber,
      req.query.numsPerPage,
    ];
    let sheets;
    if (status == 0) {
      sheets = await Sheet.find({
        owner: req.user.id,
      }).exec();
    } else {
      sheets = await Sheet.find({
        owner: req.user.id,
        statusIndex: status,
      }).exec();
    }
    const total = sheets.length;

    if (order == 0) {
      sheets.sort((sheet1, sheet2) => {
        return sheet2.createTime.getTime() - sheet1.createTime.getTime();
      });
    } else if (order == 1) {
      sheets.sort((sheet1, sheet2) => {
        return sheet1.createTime.getTime() - sheet2.createTime.getTime();
      });
    } else if (order == 2) {
      sheets.sort((sheet1, sheet2) => {
        return sheet2.answerNum - sheet1.answerNum;
      });
    } else if (order == 3) {
      sheets.sort((sheet1, sheet2) => {
        return sheet1.answerNum - sheet2.answerNum;
      });
    }

    sheets = sheets.slice(
      numsPerPage * (pageNumber - 1),
      numsPerPage * pageNumber
    );
    res.json({ code: 200, msg: "OK", data: { sheets: sheets, total: total } });
  },

  // 创建问卷
  async create(req, res) {
    const sheetInfo = req.body;
    sheetInfo.owner = req.user.id;
    const newSheet = await new Sheet(sheetInfo);
    await newSheet.save((err, saved) => {
      if (err) {
        console.log(err);
      }
      res.json({ code: 200, msg: "创建成功", data: { sheet: saved } });
    });
  },

  // 删除问卷
  async remove(req, res) {
    const id = req.params.id;
    await Sheet.deleteOne({ _id: id }).exec();
    await Question.remove({ sheet: id }).exec();
    res.json({ code: 200, msg: "删除成功", data: {} });
  },

  // 发布问卷
  release(req, res) {
    const [type, limit] = [req.body.type, req.body.limit];
    const releaseTime = Date.now();
    const id = req.params.id;

    Sheet.updateOne(
      { _id: id },
      {
        type: type,
        limit: limit,
        statusIndex: 1,
        status: "已发布",
        releaseTime: releaseTime,
      }
    ).exec((err, updated) => {
      if (err) {
        console.log(err);
      }
      res.json({ code: 200, msg: "发布成功", data: {} });
    });
  },

  // 获取问卷的基本信息
  getBasicInfo(req, res, next) {
    const id = req.params.id;
    Sheet.findOne({ _id: id }).exec((err, sheet) => {
      if (err) {
        console.log(err);
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
      }
      if (sheet === null) {
        return res.json({ code: 403, msg: "问卷不存在", data: {} });
      } else {
        let isOwner = false;
        if (sheet.owner == req.user.id) {
          isOwner = true;
        }
        res.json({
          code: 200,
          msg: "OK",
          data: { sheetInfo: sheet, isOwner: isOwner },
        });
      }
    });
  },

  // 更新问卷的基本信息
  updateBasicInfo(req, res) {
    const [name, description] = [req.body.name, req.body.description];
    const id = req.params.id;

    Sheet.updateOne({ _id: id }, { name: name, description: description }).exec(
      (err, updated) => {
        if (err) {
          console.log(err);
        }

        res.json({ code: 200, msg: "修改成功", data: {} });
      }
    );
  },

  // 获取一个问卷的问题列表
  getQuestionList(req, res) {
    const id = req.params.id;
    Question.find({ sheet: id }).exec((err, list) => {
      if (err) {
        console.log(err);
      }
      if (list === null) {
        return res.json({ code: 403, msg: "问卷不存在", data: {} });
      } else {
        list.sort((question1, question2) => {
          return question1.index - question2.index;
        });
        res.json({
          code: 200,
          msg: "OK",
          data: {
            questionList: list,
          },
        });
      }
    });
  },

  // 获取一个题目信息
  async getOneQuestion(req, res) {
    const id = req.params.id;

    const question = await Question.findOne({ _id: id }).exec();
    if (question === null) {
      const error = new Error("题目不存在");
      error.httpStatusCode = 404;
      return next(error);
    }

    res.json({ code: 200, msg: "OK", data: { question: question } });
  },

  // 创建新题目
  async createQuestion(req, res) {
    const requestBody = req.body;
    const newQuestion = await new Question(requestBody);

    newQuestion.save((err, saved) => {
      if (err) {
        console.log(err);
      }
      res.json({ code: 200, msg: "创建成功", data: {} });
    });
  },

  // 删除题目
  removeQuestion(req, res) {
    const id = req.params.questionId;
    Question.deleteOne({ _id: id }).exec((err, removed) => {
      if (err) {
        console.log(err);
      }
      res.json({ code: 200, msg: "删除成功", data: {} });
    });
  },

  // 更新问卷的题目信息
  async updateQuestionList(req, res) {
    const updateList = req.body.updateList;
    await updateList.forEach((question) => {
      Question.updateOne(
        { _id: question._id },
        {
          optionList: question.optionList,
          typeList: question.typeList,
          relative: question.relative,
          index: question.index,
          content: question.content,
        }
      ).exec();
    });
    res.json({ code: 200, msg: "OK", data: {} });
  },

  // 获取问卷的问题列表和基本信息
  async getSheet(req, res, next) {
    const id = req.params.id;

    const sheet = await Sheet.findOne({ _id: id }).exec();
    if (sheet === null) {
      const error = new Error("问卷不存在");
      error.httpStatusCode = 404;
      return next(error);
    }

    const list = await Question.find({ sheet: sheet._id }).exec();
    if (list === null) {
      const error = new Error("问卷加载失败");
      error.httpStatusCode = 404;
      return next(error);
    }

    // 非注册用户访问
    if (req.user === undefined) {
      if (sheet.type === 0 || sheet.type === 1) {
        const error = new Error("问卷只允许注册用户回答");
        error.httpStatusCode = 200;
        return next(error);
      }
    }

    return res.json({
      code: 200,
      msg: "OK",
      data: { sheet: sheet, questionList: list },
    });
  },
};
module.exports = sheetController;
