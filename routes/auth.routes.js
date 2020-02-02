const { Router } = require("express");
const { AuthController } = require("../controllers");

const router = Router();

router.post("/signup", AuthController.signup);

router.post("/signin", AuthController.signin);

module.exports = router;
