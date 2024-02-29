const createUserToken = (user) => {
  const tokenUser = { name: user.name, userId: user._id, whom: user.whom };
  return tokenUser;
};

module.exports = createUserToken;
