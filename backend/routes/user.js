const express = require("express");
const router = express.Router();

const userCtrl = require("../controllers/user");
const passCtrl = require("../middleware/pass")


router.post("/signup", userCtrl.signup);
router.post("/login",passCtrl, userCtrl.login);

module.exports = router;
