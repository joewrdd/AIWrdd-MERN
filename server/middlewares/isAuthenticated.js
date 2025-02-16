const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const UserModel = require("../models/UserModel");

//----- Middleware To Check If User Is Authenticated -----
const isAuthenticated = asyncHandler(async (req, res, next) => {
  try {
    // Get token from cookie
    const token = req.cookies.token;

    if (!token) {
      console.log("No token found in cookies");
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from token
    const user = await UserModel.findById(decoded.id).select("-password");

    if (!user) {
      console.log("No user found with token ID:", decoded.id);
      return res.status(401).json({ message: "User not found" });
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(401).json({ message: "Not authorized, token failed" });
  }
});

module.exports = isAuthenticated;
