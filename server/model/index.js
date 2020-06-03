const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const model = mongoose.model.bind(mongoose);
const ObjectId = mongoose.Schema.Types.ObjectId;

// 用户信息
const userSchema = Schema({
  name: { type: String, required: true, unique: true }, // 用户名
  email: { type: String, required: true, unique: true }, // 用户注册邮箱
  password: { type: String, required: true }, // 用户密码
});

// 问卷的基本信息
const sheetSchema = Schema({
  name: { type: String, required: true }, // 问卷名称
  description: { type: String, default: "" }, // 问卷描述
  type: { type: Number, default: 0 }, // 问卷类型，即问卷允许的答题对象和方式
  limit: { type: Number, default: 1 }, // 问卷限制填写次数
  statusIndex: { type: Number, default: 2 }, // 问卷的状态索引
  status: { type: String, default: "未发布" }, // 问卷的状态名称
  createTime: { type: Date, default: Date.now }, // 问卷的创建时间
  releaseTime: { type: Date, default: "" }, // 问卷的发布时间
  answerNum: { type: Number, default: 0 }, // 问卷的回答数量
  owner: { type: ObjectId, required: true, ref: "User" },
});

const questionSchema = Schema({
  type: { type: Number, required: true }, // 问题类型
  index: { type: Number, required: true }, // 问题在问卷中的顺序
  content: { type: String, required: true }, // 问题题目
  optionList: { type: Array, default: [] }, // 选项列表
  typeList: { type: Array, default: [] }, // 填空类型列表
  relative: { type: Array, default: [] }, // 级联选项
  sheet: { type: ObjectId, required: true, ref: "Sheet" },
});

const answerInfoSchema = Schema({
  userId: { type: ObjectId, ref: "User" }, // 回答问题的用户id
  userIp: { type: String }, // 回答问题用户的ip地址
  submitTime: { type: Date, default: Date.now }, // 提交答卷的时间
  sheetId: { type: ObjectId, required: true, ref: "Sheet" }, // 用户回答的问卷id
});

const answerSchema = Schema({
  userId: { type: ObjectId, ref: "User" }, // 回答问题的用户id
  userIp: { type: String }, // 回答问题用户的ip地址
  submitTime: { type: Date, default: Date.now }, // 提交答卷的时间
  sheetId: { type: ObjectId, required: true, ref: "Sheet" }, // 用户回答的问卷id
  questionId: { type: ObjectId, required: true, ref: "Question" }, // 用户的回答的问题id
  questionType: { type: Number, required: true }, // 用户回答的问题类型
  answerInfoId: { type: ObjectId, required: true, ref: "AnswerInfo" },
  answer: { type: Array, required: true }, // 用户的答案
});

const User = model("User", userSchema);
const Sheet = model("Sheet", sheetSchema);
const Question = model("Question", questionSchema);
const Answer = model("Answer", answerSchema);
const AnswerInfo = model("AnswerInfo", answerInfoSchema);

module.exports = { User, Sheet, Question, Answer, AnswerInfo };
