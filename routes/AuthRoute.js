const express = require("express");
const router = express.Router();

const {
  register,
  login,
  logout,
  changePassword,
} = require("../controllers/AuthController");

const { authenticateUser } = require("../middlewares/authentication");

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/changePassword").get(authenticateUser, changePassword);

module.exports = router;
