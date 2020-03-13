const {
  UserModel,
  WorkoutModel,
  ExerciseModel,
  SetModel
} = require("../models");

/**
 * POST /workout/finish
 * jwtMiddleware
 * returns new created workout object
 */
exports.finishWorkout = async (req, res) => {
  try {
    const { date, timer, exercises, userId } = req.body;

    if (!date) {
      return res.status(400).json({
        message: "You don't send any date. What is your workout date ?"
      });
    }

    if (!timer) {
      return res.status(400).json({ message: "Timer is required" });
    }

    if (!exercises || exercises.length === 0) {
      return res
        .status(400)
        .json({ message: "Do some exercies before you finish workout" });
    }

    try {
      await ExerciseModel.collection.insertMany(exercises);
    } catch (err) {
      console.log("save exercises err: ", err);
    }

    const workout = new WorkoutModel({
      date,
      timer,
      exercises,
      user: userId
    });

    try {
      await workout.save();
    } catch (err) {
      console.log("Workout save err: ", err);
      return res.status(400).json({ message: err.message });
    }

    await workout.populate("exercises", "sets").execPopulate();
    res.json({ message: "Finish workout success", workout });
  } catch (err) {
    console.log(err);
  }
};
