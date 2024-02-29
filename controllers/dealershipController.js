const { StatusCodes } = require("http-status-codes");
const CustomAPIError = require("../errors");
const { ObjectId } = require("mongodb");
const { getClient } = require("../db/connectDB");

const createCar = async (req, res) => {
  try {
    const db = getClient().db("Internship");
    const collection = db.collection("cars");
    const data = { ...req.body, state: "" };

    const carResult = await collection.insertOne(data);
    const newCarId = carResult.insertedId;

    const updateResult = await db
      .collection("users")
      .updateOne(
        { _id: new ObjectId(req.user.userId) },
        { $push: { cars: newCarId } }
      );

    if (updateResult.modifiedCount > 0) {
      console.log(`New car created and associated with dealer`);
    } else {
      console.log(`Dealer not found with id`);
    }

    res
      .status(StatusCodes.CREATED)
      .json({ message: "Created Successfully", carResult, updateResult });
  } catch (error) {
    console.error(error);
    res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: error.message || "Internal Server Error",
    });
  }
};

const createDeal = async (req, res) => {
  try {
    const db = getClient().db("Internship");
    const collection = db.collection("deals");
    const result = await collection.insertOne(req.body);
    const newDealId = result.insertedId;

    const carCollection = db.collection("cars");

    const updateResult = await db
      .collection("users")
      .updateOne(
        { _id: new ObjectId(req.user.userId) },
        { $push: { deals: newDealId } }
      );
    const carResult = await carCollection.updateOne(
      { _id: new ObjectId(req.body.carId) },
      { $set: { state: "deal" } }
    );
    res
      .status(StatusCodes.CREATED)
      .json({ message: "Created Successfully", result, updateResult });
  } catch (error) {
    console.error(error);
    res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: error.message || "Internal Server Error",
    });
  }
};

const soldCarsWithOwner = async (req, res) => {
  try {
    // console.log(res.user);
    const db = getClient().db("Internship");
    const collection = db.collection("users");
    const dealer = await collection.findOne({
      _id: new ObjectId(req.user.userId),
    });

    const carDetails = [];
    const carCollection = db.collection("cars");
    const soldCars = dealer.soldVehicles;
    console.log(soldCars);
    for (const carId of soldCars) {
      const car = await carCollection.findOne({ _id: new ObjectId(carId) });
      carDetails.push(car);
    }
    res.send(carDetails);
  } catch (error) {
    res.send(err);
  }
  // res.send("Sold Details");
};

module.exports = {
  createCar,
  createDeal,
  soldCarsWithOwner,
};
