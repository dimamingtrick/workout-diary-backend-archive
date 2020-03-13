const { Router } = require("express");
const { WorkoutController } = require("../controllers");

const router = Router();

router.get("/", WorkoutController.getWorkoutsList);

router.get("/:id", WorkoutController.getWorkout);

router.post("/finish", WorkoutController.finishWorkout);

module.exports = router;
