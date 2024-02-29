const { StatusCodes } = require("http-status-codes");
const CustomAPIError = require("../errors");
const { ObjectId } = require("mongodb");
const { getClient } = require("../db/connectDB");

const getAllCars = async (req, res) => {
  try {
    const db = getClient().db("Internship");
    const collection = db.collection("cars");
    const result = await collection.find({}).toArray();

    if (result.length === 0) {
      throw new CustomAPIError.BadRequestError("Empty Database");
    }

    res.status(StatusCodes.OK).json({ result, count: result.length });
  } catch (error) {
    res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: error.message || "Internal Server Error",
    });
  }
};

const viewSingleDealerCar = async (req, res) => {
  try {
    const { id } = req.params;
    const db = getClient().db("Internship");
    const collection = db.collection("users");

    const dealer = await collection
      .find({
        _id: new ObjectId(id),
        whom: "dealer",
      })
      .toArray();

    const cars = dealer[0].cars;

    const carDetails = [];
    const carCollection = db.collection("cars");

    for (const carId of cars) {
      const car = await carCollection.findOne({ _id: carId });
      carDetails.push(car);
    }

    res.json({ carDetails });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const buyVehicle = async (req, res) => {
  try {
    const { dealerId } = req.body;
    const { carId } = req.params;
    const db = getClient().db("Internship");
    const soldCollection = db.collection("soldVehicle");
    const soldInfo = await soldCollection.insertOne({
      carId: carId,
      vehicleInfo: {},
    });

    const soldId = soldInfo.insertedId;

    const updateUser = await db
      .collection("users")
      .updateOne(
        { _id: new ObjectId(req.user.userId) },
        { $push: { vehicleInfo: soldId } }
      );
    const updateCar = await db
      .collection("cars")
      .updateOne({ _id: new ObjectId(carId) }, { $set: { state: "sold" } });

    const user = await db
      .collection("users")
      .findOne({ _id: new ObjectId(req.user.userId) });
    const updateDealer = await db
      .collection("users")
      .updateOne(
        { _id: new ObjectId(dealerId) },
        { $push: { soldVehicles: soldId } }
      );

    const dealId = await db.collection("deals").findOne({ carId: carId });
    const dealer = await db
      .collection("users")
      .findOne({ deals: { $in: [dealId._id] } });
    const allDetails = {
      dealId,
      dealer,
      user,
    };
    res.status(StatusCodes.OK).json(allDetails);

    // res.status(StatusCodes.OK).json({ soldInfo, updateUser, updateDealer });
  } catch (error) {
    res.send(error);
  }
};

const getDeals = async (req, res) => {
  const { dealerId } = req.params;
  const db = getClient().db("Internship");
  const collection = db.collection("users");

  const user = await collection.findOne({
    _id: new ObjectId(dealerId),
    whom: "dealer",
  });
  const carDetails = [];
  const carCollection = db.collection("deals");
  for (const carDetail of user.deals) {
    const car = await carCollection.findOne({ _id: new ObjectId(carDetail) });
    carDetails.push(car);
  }
  // res.send(user);

  res.send(carDetails);
};

module.exports = { getAllCars, viewSingleDealerCar, buyVehicle, getDeals };
