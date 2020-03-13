const { Schema, model } = require("mongoose");

const ExerciseSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  sets: [
    {
      id: String,
      weight: {
        type: Number,
        default: 0
      },
      reps: {
        type: Number,
        default: 0,
        required: true
      },
      comment: String
    }
  ]
});

module.exports = model("Exercise", ExerciseSchema);
