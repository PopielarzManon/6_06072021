const express = require("express");
const router = express.Router();

const userCtrl = require("../controllers/user");
const passCtrl = require("../middleware/pass")


router.post("/signup", passCtrl, userCtrl.signup);
router.post("/login", userCtrl.login);

module.exports = router;
