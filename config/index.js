const PASSWORD_HASH = process.env.PASSWORD_HASH || 10;
const JWT_PRIVATE_KEY = process.env.JWT_PRIVATE_KEY || "dimaming___trickJWT";

module.exports = {
  PASSWORD_HASH,
  JWT_PRIVATE_KEY
};
