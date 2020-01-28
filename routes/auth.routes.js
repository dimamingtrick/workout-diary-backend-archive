const { Router } = require("express");
const { AuthController } = require("../controllers");

const router = Router();

router.get("/signin", AuthController.signin);

module.exports = router;
