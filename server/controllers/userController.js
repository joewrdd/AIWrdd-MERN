const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const UserModel = require("../models/UserModel");
const isAuthenticated = require("../middlewares/isAuthenticated");

//----- Registration -----
const register = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  //Validate Required Fields
  if (!username || !email || !password) {
    res.status(400);
    throw new Error("All fields are required.");
  }

  //Check If User Already Exists
  const userExists = await UserModel.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User Already Exists!");
  }

  //Hash Password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  //Create New User
  const newUser = new UserModel({
    username,
    password: hashedPassword,
    email,
  });

  //Set Trial Period Expiry
  newUser.trialExpires = new Date(
    new Date().getTime() + newUser.trialPeriod * 24 * 60 * 60 * 1000
  );

  //Save User To Database
  await newUser.save();

  res.json({
    status: true,
    message: "Registration was successful",
    user: {
      username,
      email,
    },
  });
});

//----- Login -----
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  //Find User By Email
  const user = await UserModel.findOne({ email });
  if (!user) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  //Validate Password
  const isMatchPass = await bcrypt.compare(password, user?.password);
  if (!isMatchPass) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  //Generate JWT Token
  const token = jwt.sign({ id: user?._id }, process.env.JWT_SECRET, {
    expiresIn: "3d",
  });

  //Set Token In Cookie
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "Production",
    sameSite: "strict",
    maxAge: 24 * 60 * 60 * 1000,
  });

  res.json({
    status: "success",
    _id: user?._id,
    message: "Login Successful",
    username: user?.username,
    email: user?.email,
  });
});

//----- Logout -----
const logout = asyncHandler(async (req, res) => {
  //Set Token In Cookie
  res.cookie("token", "", { maxAge: 1 });

  res.status(200).json({ message: "Logged out successfully" });
});

//----- Profile -----
const userProfile = asyncHandler(async (req, res) => {
  //Find User By ID (Exclude Password)
  const user = await UserModel.findById(req?.user?._id)
    .select("-password")
    .populate("payments")
    .populate("history");

  if (user) {
    res.status(200).json({
      status: "success",
      user,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

//----- Authenticated Status -----
const checkAuth = asyncHandler(async (req, res) => {
  const decoded = jwt.verify(req.cookies.token, process.env.JWT_SECRET);
  if (decoded) {
    res.json({
      isAuthenticated: true,
    });
  } else {
    res.json({
      isAuthenticated: false,
    });
  }
});

module.exports = {
  register,
  login,
  logout,
  userProfile,
  checkAuth,
};
