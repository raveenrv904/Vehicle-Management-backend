const express = require("express");
const router = express.Router();
const {
  authenticateUser,
  autherizePermission,
} = require("../middlewares/authentication");

const {
  getAllDeals,
  getAllDetails,
  getCarDealership,
  userVehicle,
  getAllDealership,
} = require("../controllers/UserController");

router.route("/getAllDealers").get(authenticateUser, getAllDealership);
router
  .route("/getAllDetails")
  .get(authenticateUser, autherizePermission("user"), getAllDetails);
router
  .route("/getCarDealership/:carId")
  .get(authenticateUser, autherizePermission("user"), getCarDealership);
router
  .route("/getAllDeals/:carId")
  .get(authenticateUser, autherizePermission("user"), getAllDeals);
router
  .route("/userVehicle/:userId")
  .get(authenticateUser, autherizePermission("user"), userVehicle);

module.exports = router;
