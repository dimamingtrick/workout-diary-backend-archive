const { verify } = require("jsonwebtoken");
const { JWT_PRIVATE_KEY } = require("../config");

module.exports = (req, res, next) => {
  verify(req.headers.token, JWT_PRIVATE_KEY, (err, decoded) => {
    if (err) {
      return res.status(400).json({ status: "error", message: err.message });
    }

    if (Date.now >= decoded.exp) {
      return res.json({ status: "error", message: "Token has been expired" });
    }

    req.body.userId = decoded._id;
    next();
  });
};
