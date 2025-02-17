const asyncHandler = require("express-async-handler");
const UserModel = require("../models/UserModel");

//----- API Request Limit For Plans -----
const checkAPIRequestLimit = asyncHandler(async (req, res, next) => {
  if (!req.user?._id) {
    return res.status(401).json({
      status: false,
      message: "Not authorized",
    });
  }

  const user = await UserModel.findById(req.user._id);

  if (!user) {
    return res.status(404).json({
      status: false,
      message: "User not found",
    });
  }

  //----- Request Limit Per Subscription Plan -----
  let requestLimit = 0;
  if (user?.trialActive) {
    requestLimit = user?.monthlyRequestCount;
  }

  if (user?.apiRequestCount >= requestLimit) {
    throw new Error("API Request Limit Reached... Please Subscribe To A Plan!");
  }
  next();
});

module.exports = checkAPIRequestLimit;
