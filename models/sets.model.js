const { Schema, model } = require("mongoose");

const SetsSchema = new Schema({
  weight: {
    type: Number,
    default: 0
  },
  reps: {
    type: Number,
    required: true
  },
  comment: {
    type: String
  }
});

module.exports = model("Set", SetsSchema);
