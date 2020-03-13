const { Router } = require("express");
const { WorkoutController } = require("../controllers");

const router = Router();

router.post("/finish", WorkoutController.finishWorkout);

module.exports = router;
