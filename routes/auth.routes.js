const { Router } = require("express");
const { AuthController } = require("../controllers");
const { jwtMiddleware } = require("../middlewares");

const router = Router();

router.get("/me", jwtMiddleware, AuthController.getMe);

router.post("/sign-up", AuthController.signUp);

router.post("/sign-in", AuthController.signIn);

module.exports = router;
