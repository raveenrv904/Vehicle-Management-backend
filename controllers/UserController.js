const { StatusCodes } = require("http-status-codes");
const { ObjectId } = require("mongodb");
const { getClient } = require("../db/connectDB");

const getCarDealership = async (req, res) => {
  try {
    const { carId } = req.params;
    const db = getClient().db("Internship");
    const collection = db.collection("users");

    const dealers = await collection
      .find({ cars: { $in: [new ObjectId(carId)] } })
      .toArray();

    if (dealers.length === 0) {
      return res.status(404).send("No dealers found for the specified carId");
    }

    res.send(dealers);
  } catch (error) {
    console.error("Error fetching dealers:", error);

    if (error.name === "MongoError" && error.code === 18) {
      return res.status(400).send("Invalid carId format");
    }
    res.status(500).send("Internal Server Error");
  }
};

const getAllDetails = async (req, res) => {
  try {
    const db = getClient().db("Internship");
    const userCollection = db.collection("users");

    const user = await userCollection.findOne({
      _id: new ObjectId(req.user.userId),
    });

    if (!user) {
      return res.status(404).send("User not found");
    }

    const soldVehicleCollection = db.collection("soldVehicle");
    const carCollection = db.collection("cars");
    const allDetails = [];

    for (const soldId of user.vehicleInfo) {
      const vehicleId = await soldVehicleCollection.findOne({
        _id: new ObjectId(soldId),
      });

      const dealerData = await carCollection
        .find({
          soldVehicles: { $in: [soldId] },
        })
        .toArray();

      if (dealerData.length > 0) {
        vehicleId.dealer = dealerData;
        allDetails.push(vehicleId);
      }
    }

    res.status(StatusCodes.OK).json({ allDetails });
  } catch (error) {
    console.error("Error fetching details:", error);
    res.status(500).send("Internal Server Error");
  }
};

const getAllDeals = async (req, res) => {
  try {
    const { carId } = req.params;
    const db = getClient().db("Internship");
    const collection = db.collection("deals");

    const allDeals = [];

    const dealershipCollection = db.collection("users");
    const deals = await collection.find({ carId: carId }).toArray();
    // console.log(deals);
    // for (const deal of deals) {
    //   const dealId = deal._id;
    //   const dealership = await dealershipCollection
    //     .find({ deals: { $in: [dealId] } })
    //     .toArray();
    //   if (dealership.length > 0) {
    //     allDeals.push(dealership);
    //   }
    // }
    res.send(deals);
  } catch (error) {
    console.error("Error fetching deals:", error);
    res.status(500).send("Internal Server Error");
  }
};

const userVehicle = async (req, res) => {
  try {
    const { userId } = req.params;
    const db = getClient().db("Internship");
    const collection = db.collection("users");
    const user = await collection.findOne({
      _id: new ObjectId(userId),
      whom: "user",
    });

    // console.log(userId);

    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }

    const vehicleId = user.vehicleInfo;
    const vehicle = [];

    for (const id of vehicleId) {
      try {
        const soldVehicle = await db
          .collection("soldVehicle")
          .findOne({ _id: new ObjectId(id) });

        if (!soldVehicle) {
          return res
            .status(404)
            .send({ error: `Sold vehicle with ID ${id} not found` });
        }

        const car = await db
          .collection("cars")
          .findOne({ _id: new ObjectId(soldVehicle.carId) });

        if (!car) {
          return res
            .status(404)
            .send({ error: `Car with ID ${soldVehicle.carId} not found` });
        }

        vehicle.push(car);
      } catch (error) {
        console.error(`Error fetching data for vehicle with ID ${id}:`, error);
        return res.status(500).send({ error: "Internal Server Error" });
      }
    }

    res.send(vehicle);
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

const getAllDealership = async (req, res) => {
  const db = getClient().db("Internship");
  const dealers = await db.collection("users").find({}).toArray();
  res.send(dealers);
};

module.exports = {
  getAllDetails,
  getAllDeals,
  getCarDealership,
  userVehicle,
  getAllDealership,
};
