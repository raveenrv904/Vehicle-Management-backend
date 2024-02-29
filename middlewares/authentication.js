const CustomAPIError = require("../errors");
const { isValidToken } = require("../utils");

const authenticateUser = async (req, res, next) => {
  let token;
  if (req.signedCookies.token) {
    token = req.signedCookies.token;
  } else {
    token = req.header("token");
  }
  console.log(req.header("token"));
  if (!token) {
    throw new CustomAPIError.UnauthenticatedError("Authentication Invalid");
  }
  try {
    const payload = isValidToken({ token });
    req.user = {
      name: payload.name,
      userId: payload.userId,
      whom: payload.whom,
    };
    next();
  } catch (error) {
    throw new CustomAPIError.UnauthenticatedError("Authentication invalid");
  }
};

const autherizePermission = (role) => {
  return (req, res, next) => {
    if (role !== req.user.whom) {
      throw new CustomAPIError.unAuthorized(
        "Unauthorized access to this route"
      );
    }
    next();
  };
};

module.exports = { authenticateUser, autherizePermission };
