const express = require("express");
const router = express.Router();
const {
  getAllCars,
  viewSingleDealerCar,
  buyVehicle,
  getDeals,
} = require("../controllers/commonController");

const { authenticateUser } = require("../middlewares/authentication");

router.route("/").get(authenticateUser, getAllCars);
router.route("/getDeals/:dealerId").get(authenticateUser, getDeals);
router.route("/:id").get(authenticateUser, viewSingleDealerCar);
router.route("/buyNow/:carId").post(authenticateUser, buyVehicle);

module.exports = router;
