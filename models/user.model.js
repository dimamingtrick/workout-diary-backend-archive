const { Schema, model } = require("mongoose");

const UserSchema = new Schema({
  name: {
    type: String,
    require: true
  },
  email: {
    type: String,
    require: true,
    unique: true
  },
  password: {
    type: String,
    require: true,
    select: false
  },
  registeredAt: {
    type: Date,
    default: new Date()
  }
});

module.exports = model("User", UserSchema);
