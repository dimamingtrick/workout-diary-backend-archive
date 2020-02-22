const jwt = require("jsonwebtoken");
const { JWT_PRIVATE_KEY } = require("../config");

module.exports.validateEmail = email => {
  //eslint-disable-next-line
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

module.exports.generateJwt = _id => {
  return jwt.sign({ _id }, JWT_PRIVATE_KEY, {
    expiresIn: "10h"
  });
};
