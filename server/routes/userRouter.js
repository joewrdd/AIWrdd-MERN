const express = require("express");
const {
  register,
  login,
  logout,
  userProfile,
  checkAuth,
} = require("../controllers/userController");
const isAuthenticated = require("../middlewares/isAuthenticated");

const userRouter = express.Router();

//----- Route To Register A New User -----
userRouter.post("/register", register);

//----- Route To Log In A User -----
userRouter.post("/login", login);

//----- Route To Log Out A User -----
userRouter.post("/logout", logout);

//----- Route To Get User Profile (Requires Authentication) -----
userRouter.get("/profile", isAuthenticated, userProfile);

//----- Route To Check Authentication -----
userRouter.get("/auth/check", isAuthenticated, checkAuth);

module.exports = userRouter;
