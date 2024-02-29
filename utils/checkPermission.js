const CustomAPIError = require("../errors");

const checkDealerPermission = (requestUser, resourcesUser) => {
  console.log(requestUser);
  console.log(resourcesUser);
};

module.exports = checkDealerPermission;
