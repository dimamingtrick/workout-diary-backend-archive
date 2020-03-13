const {
  UserModel,
  WorkoutModel,
  ExerciseModel,
  SetModel
} = require("../models");

/**
 * GET /workout
 * jwtMiddleware
 * returns list of users workouts
 */
exports.getWorkoutsList = async (req, res) => {
  try {
    const { userId } = req.body;

    const workouts = await WorkoutModel.find({ user: userId })
      .populate("exercises")
      .exec();

    res.json({ workouts });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err.message });
  }
};

/**
 * GET /workout/:id
 * jwtMiddleware
 * return single workout by id
 */
exports.getWorkout = async (req, res) => {
  try {
    const { id } = req.params;

    const workout = await WorkoutModel.findById(id)
      .populate("exercises")
      .exec();

    res.json({ workout });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

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

    const allExercisesHaveName = exercises.every(exercise => !!exercise.name);
    if (!allExercisesHaveName) {
      return res.status(400).json({ message: "Name all exercises" });
    }

    const allExercisesHaveSets = exercises.every(
      exercise => exercise.sets && exercise.sets > 0
    );
    if (!allExercisesHaveSets) {
      return res
        .status(400)
        .json({ message: "Add at least 1 set to every exercise" });
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
