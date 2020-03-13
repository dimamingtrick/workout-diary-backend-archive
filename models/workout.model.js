const { Schema, model } = require("mongoose");

const WorkoutSchema = new Schema({
  date: {
    type: Date,
    default: new Date()
  },
  timer: {
    type: String,
    default: "00:00:00"
  },
  exercises: [
    {
      type: Schema.Types.ObjectId,
      ref: "Exercise",
      required: true
    }
  ],
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
});

module.exports = model("Workout", WorkoutSchema);
