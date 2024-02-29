const express = require("express");
const router = express.Router();

const {
  createCar,
  createDeal,
  soldCarsWithOwner,
} = require("../controllers/dealershipController");

const {
  authenticateUser,
  autherizePermission,
} = require("../middlewares/authentication");

router
  .route("/createCar")
  .post(authenticateUser, autherizePermission("dealer"), createCar);
router
  .route("/createDeal")
  .post(authenticateUser, autherizePermission("dealer"), createDeal);
router
  .route("/soldCar")
  .get(authenticateUser, autherizePermission("dealer"), soldCarsWithOwner);

module.exports = router;
