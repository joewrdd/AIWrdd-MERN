const express = require("express");
const isAuthenticated = require("../middlewares/isAuthenticated");
const openAIController = require("../controllers/openAIController");
const checkAPIRequestLimit = require("../middlewares/checkAPIRequestLimit");

const openAIRouter = express.Router();

//----- Route To Get User Profile (Requires 1) Authentication 2) Checks User Limit To See If He Has Enough Credits for Gen) -----
openAIRouter.post(
  "/generate-content",
  isAuthenticated,
  checkAPIRequestLimit,
  openAIController
);

module.exports = openAIRouter;
