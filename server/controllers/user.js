const Model = require("../model");
const { User } = Model;
const jwt = require("jsonwebtoken");
const { privateKey } = require("../config/index");

const md5 = require("md5-node");

const userController = {
  // 测试用路由，显示所有的用户
  async all(req, res) {
    const users = await User.find({}).exec();
    res.json({ code: 200, msg: "OK", data: { users } });
  },

  // 获取用户信息
  getOne(req, res) {
    const id = req.user.id;
    User.findOne({ _id: id }).exec((err, user) => {
      if (err) {
        console.log(err);
      }
      res.json({
        code: 200,
        msg: "OK",
        data: {
          user: {
            name: user.name,
          },
        },
      });
    });
  },

  // 添加用户
  async create(req, res) {
    const requestBody = req.body;
    requestBody.password = md5(requestBody.password);

    const findName = await User.findOne({ name: requestBody.name }).exec();
    if (findName !== null) {
      return res.json({ code: 403, msg: "当前用户名已被注册过" });
    }

    const findEmail = await User.findOne({ email: requestBody.email }).exec();
    if (findEmail !== null) {
      return res.json({ code: 403, msg: "当前邮箱已被注册过" });
    }

    const newUser = await new User(requestBody);
    await newUser.save((err, saved) => {
      if (err) {
        console.log(err);
      }
      res.json({ code: 200, msg: "注册成功", data: { user: saved } });
    });
  },

  // 用户登录验证
  async verify(req, res) {
    const requestBody = req.body;
    requestBody.password = md5(requestBody.password);

    const user = await User.findOne({ email: requestBody.email }).exec();
    if (user === null) {
      return res.json({ code: 403, msg: "邮箱不存在" });
    } else if (user.password !== requestBody.password) {
      return res.json({ code: 403, msg: "密码错误" });
    } else {
      const token =
        "Bearer " +
        jwt.sign(
          { email: user.email, id: user._id, name: user.name },
          privateKey,
          {
            expiresIn: "1h",
          }
        );
      res.json({ code: 200, msg: "登录成功", data: { token } });
    }
  },
};

module.exports = userController;
