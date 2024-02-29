const authSchema = {
  email: {
    type: "string",
    unique: true,
  },
  name: {
    type: "string",
  },
  location: {
    type: "string",
  },
  password: {
    type: "string",
  },
  info: {
    type: "object",
  },
  cars: [
    {
      type: "objectId",
    },
  ],
  deals: [
    {
      type: "objectId",
    },
  ],
  soldVehicles: [
    {
      type: "objectId",
    },
  ],
  vehicleInfo: [
    {
      type: ObjectId,
    },
  ],
  whom: {
    type: "string",
  },
};

module.exports = authSchema;
