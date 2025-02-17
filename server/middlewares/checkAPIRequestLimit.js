const asyncHandler = require("express-async-handler");
const UserModel = require("../models/UserModel");

//----- API Request Limit For Plans -----
const checkAPIRequestLimit = asyncHandler(async (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      message: "Not authorized",
    });
  }

  const user = await UserModel.findById(req.user?.id);

  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  //----- Request Limit Per Subscription Plan -----
  let requestLimit = user?.monthlyRequestCount || 0;

  // Checks If User Reached Limit
  if (user?.apiRequestCount >= requestLimit) {
    throw new Error("API Request Limit Reached... Please Subscribe To A Plan!");
  }

  next();
});

module.exports = checkAPIRequestLimit;
