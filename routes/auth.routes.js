const { Router } = require("express");
const { AuthController } = require("../controllers");
const { jwtMiddleware } = require("../middlewares");

const router = Router();

router.get("/me", jwtMiddleware, AuthController.getMe);

router.post("/signup", AuthController.signup);

router.post("/signin", AuthController.signin);

module.exports = router;
