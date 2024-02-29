const { StatusCodes } = require("http-status-codes");
const CustomAPIError = require("../errors");
const { getClient } = require("../db/connectDB");

const createUserToken = require("../utils/createUserToken");
const { attachCookiesToResponse } = require("../utils/jwt");
const { ObjectId } = require("mongodb");

const register = async (req, res) => {
  try {
    const { email, name, password, info, location, whom } = req.body;
    if (!email || !name || !password || !location || !whom) {
      throw new CustomAPIError.BadRequestError(
        "Email Already Exists. Please Login"
      );
    }
    const db = getClient().db("Internship");
    const collection = db.collection("users");

    const emailAlreadyExists = await collection.findOne({ email });
    if (emailAlreadyExists) {
      throw new CustomAPIError.unAuthorized(
        "Email Already Exists. Please Login"
      );
    }

    let result;

    if (whom == "user") {
      result = await collection.insertOne({
        email,
        name,
        password,
        location,
        info,
        whom,
        vehicleInfo: [],
      });
    } else {
      result = await collection.insertOne({
        email,
        name,
        password,
        location,
        info,
        whom,
        cars: [],
        deals: [],
        soldVehicles: [],
      });
    }

    const tokenUser = createUserToken(result);
    attachCookiesToResponse({ res, user: tokenUser });

    res.status(StatusCodes.CREATED).json({ result });
  } catch (error) {
    // Handle errors
    console.error(error);
    res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: error.message || "Internal Server Error",
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new CustomAPIError.BadRequestError(
        "Please provide both email and password"
      );
    }
    const db = getClient().db("Internship");
    const collection = db.collection("users");

    const result = await collection.findOne({ email, password });
    if (!result) {
      throw new CustomAPIError.UnauthenticatedError("Invalid Credentials");
    }

    const tokenUser = createUserToken(result);
    const token = attachCookiesToResponse({ res, user: tokenUser });

    res.status(StatusCodes.OK).json({ result, token });
  } catch (error) {
    // Handle errors
    console.error(error);
    res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: error.message || "Internal Server Error",
    });
  }
};

const logout = async (req, res) => {
  try {
    res.cookie("token", "logout", {
      httpOnly: true,
      expires: new Date(Date.now()),
    });
    res.clearCookie("token");

    res.status(StatusCodes.OK).json({ msg: "User logged Out!" });
  } catch (error) {
    console.error(error);
    res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: error.message || "Internal Server Error",
    });
  }
};

const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const db = getClient().db("Internship");
    const collection = db.collection("users");

    const user = await collection.findOne({
      _id: new ObjectId(req.user.userId),
    });

    if (!user || user.password !== oldPassword) {
      return res.status(401).send("Invalid old password");
    }

    const updateUser = await collection.updateOne(
      { _id: new ObjectId(req.user.userId) },
      { $set: { password: newPassword } }
    );

    res.send({
      status: "success",
      message: "Password updated successfully",
      updateUser,
    });
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = { register, login, logout, changePassword };
