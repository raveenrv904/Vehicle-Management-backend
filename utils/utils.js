const bcryptjs = require("bcryptjs");

const hashPassword = async (password) => {
  const salt = await bcryptjs.genSalt(10);
  return bcryptjs.hash(password, salt);
};

const comparePassword = async (candidatePassword, currentPassword) => {
  const isMatch = await bcryptjs.compare(candidatePassword, currentPassword);
  return isMatch;
};

module.exports = { hashPassword, comparePassword };
