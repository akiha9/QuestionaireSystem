const jwt = require("jsonwebtoken");
const expressjwt = require("express-jwt");
const { privateKey } = require("../config/index");

const jwtAuth = expressjwt({
  secret: privateKey,
  credentialsRequired: true,
}).unless({
  path: [
    "/api/users/regist",
    "/api/users/login",
    /\/api\/sheets\/.+\/all/,
    { url: /\/api\/sheets\/.+\/answer/, methods: ["POST"] },
  ],
});

const jwtDecode = (req, res, next) => {
  let token = req.headers["authorization"];
  if (token) {
    token = token.slice(7);
    jwt.verify(token, privateKey, (err, user) => {
      req.user = user;
    });
  }
  next();
};

module.exports = {
  jwtAuth,
  jwtDecode,
};
