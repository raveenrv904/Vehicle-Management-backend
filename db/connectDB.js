const { MongoClient, ServerApiVersion } = require("mongodb");
const carSchema = require("../models/Car");
const dealSchema = require("../models/Deal");
const soldVehiclesSchema = require("../models/SoldVehicle");

let clientDb;
const connectDB = async (url) => {
  const client = new MongoClient(url, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });
  try {
    await client.connect();
    console.log("Connected to Database");
    const db = client.db("Internship");

    const carCollections = await db.listCollections({ name: "cars" }).toArray();
    const userCollection = await db
      .listCollections({ name: "users" })
      .toArray();

    const dealCollection = await db
      .listCollections({ name: "deals" })
      .toArray();

    const soldVehiclesCollection = await db
      .listCollections({ name: "soldVehicle" })
      .toArray();

    if (soldVehiclesCollection.length === 0) {
      await db.createCollection("soldVehicle", {
        validator: {
          $jsonSchema: {
            bsonType: "object",
            required: ["carId"],
            properties: soldVehiclesSchema,
          },
        },
      });
      console.log("Sold Vehicle collection created successfully");
    }
    if (dealCollection.length === 0) {
      await db.createCollection("deals", {
        validator: {
          $jsonSchema: {
            bsonType: "object",
            required: ["carId"],
            properties: dealSchema,
          },
        },
      });
      console.log("Deal collection created successfully");
    }

    if (carCollections.length == 0) {
      await db.createCollection("cars", {
        validator: {
          $jsonSchema: {
            bsonType: "object",
            required: ["type", "name", "model"],
            properties: carSchema,
          },
        },
      });
      console.log("Car collection created successfully");
    }

    if (userCollection.length == 0) {
      await db.createCollection("users", {
        validator: {
          $jsonSchema: {
            bsonType: "object",
            required: ["email", "name", "password"],
            properties: carSchema,
          },
        },
      });
      console.log("User collection created successfully");
    }

    // await client.close();
    clientDb = client;
    return;
  } catch (error) {
    console.error("Error connecting to the database:", error.message);
    throw error;
  }
};

const getClient = () => {
  if (!clientDb) {
    throw new Error("Database not connected");
  }
  return clientDb;
};

module.exports = { connectDB, getClient };
