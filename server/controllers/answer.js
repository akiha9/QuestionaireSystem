const Model = require("../model");
const { Sheet, Answer, AnswerInfo, User } = Model;
const { Redis } = require("../middleware/redis");

const answerController = {
  async createMany(req, res, next) {
    let answerList = req.body.answerList;

    // 检验问卷是否存在
    const sheetId = req.params.id;
    const sheet = await Sheet.findOne({ _id: sheetId }).exec();
    if (sheet === null) {
      const error = new Error("问卷不存在");
      error.httpStatusCode = 404;
      return next(error);
    }

    // 检验用户是否登录，获取userId
    let [userId, ip] = [null, null];
    if (req.user === undefined) {
      if (sheet.type === 0 || sheet.type === 1) {
        const error = new Error("问卷只允许注册用户回答");
        error.httpStatusCode = 200;
        return next(error);
      }
    } else {
      userId = req.user.id;
    }

    // 向答卷中添加对应的信息
    answerList.forEach((answer) => {
      answer.sheetId = sheetId;
      if (userId !== null) {
        answer.userId = userId;
      }
    });

    // 检查用户的答题次数
    const [type, limit] = [sheet.type, sheet.limit];

    // 每天可以答题，需要设置过期时间
    let expire = null;
    if (type === 1 || type === 3) {
      const timeStamp = new Date(new Date().setHours(0, 0, 0, 0)) / 1000;
      const oneDayLater = timeStamp + 86400;
      expire = oneDayLater;
    }

    if (type === 0 || type === 1) {
      let answerCount = (await Redis.getUserCount(userId)) || 0;
      // 用户第一次进行答题，需要在redis内设置过期时间

      if (answerCount >= limit) {
        const error = new Error("当前用户回答次数已达到上限");
        error.httpStatusCode = 200;
        return next(error);
      }
      await Redis.addUserCount(userId, expire);
    } else if (type === 2 || type === 3) {
      ip = req.ip;
      if (ip.indexOf("::ffff:") !== -1) {
        ip = ip.substring(7);
      }
      let answerCount = (await Redis.getIpCount(ip)) || 0;

      if (answerCount >= limit) {
        const error = new Error("当前用户回答次数已达到上限");
        error.httpStatusCode = 200;
        return next(error);
      }
      await Redis.addIpCount(ip, expire);
      answerList.forEach((answer) => {
        answer.userIp = ip;
      });
    }

    let answerInfo = { sheetId: sheetId };
    if (userId) {
      answerInfo.userId = userId;
    }
    if (ip) {
      answerInfo.userIp = ip;
    }
    const newAnswerInfo = await new AnswerInfo(answerInfo);
    await newAnswerInfo.save();
    await Sheet.updateOne(
      { _id: sheetId },
      { answerNum: ++sheet.answerNum }
    ).exec();

    answerList.forEach((answer) => {
      answer.answerInfoId = newAnswerInfo._id;
    });
    Answer.insertMany(answerList, (err, saved) => {
      if (err) {
        console.log(err);
      }
      res.json({ code: 200, msg: "问卷已经成功提交", data: {} });
    });
  },

  // 获取全部的答卷信息
  async fetchAnswerInfoList(req, res, next) {
    const sheetId = req.params.id;

    let answerInfoList = await AnswerInfo.find({ sheetId: sheetId }).exec();

    res.json({
      code: 200,
      msg: "OK",
      data: { answerInfoList: answerInfoList },
    });
  },

  // 按一次回答查看答卷
  async fetchByAnswerInfoId(req, res, next) {
    const [sheetId, answerId] = [req.params.id, req.query.answerId];
    let answerList = await Answer.find({
      sheetId: sheetId,
      answerInfoId: answerId,
    }).exec();

    res.json({ code: 200, msg: "OK", data: { answerList: answerList } });
  },

  // 按问题查看答案
  async fetchByQuestionId(req, res, next) {
    const [sheetId, questionId] = [req.params.id, req.query.questionId];

    const answers = await Answer.find({
      sheetId: sheetId,
      questionId: questionId,
    }).exec();

    res.json({ code: 200, msg: "OK", data: { answers, answers } });
  },
};

module.exports = answerController;
