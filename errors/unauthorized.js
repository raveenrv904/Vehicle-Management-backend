const { StatusCodes } = require("http-status-codes");
const CustomAPIError = require("./custom-api");

class unAuthorized extends CustomAPIError {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.FORBIDDEN;
  }
}

module.exports = unAuthorized;
