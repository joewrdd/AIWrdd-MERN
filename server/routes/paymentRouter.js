const express = require("express");
const isAuthenticated = require("../middlewares/isAuthenticated");
const {
  handleStripePayment,
  handleFreeSubscription,
  verifyPayment,
} = require("../controllers/paymentController");

const paymentRouter = express.Router();

//----- Handles All Payment Required Routes -----
paymentRouter.post("/checkout", isAuthenticated, handleStripePayment);
paymentRouter.post("/free-plan", isAuthenticated, handleFreeSubscription);
paymentRouter.post(
  "/verify-payment/:paymentId",
  isAuthenticated,
  verifyPayment
);

module.exports = paymentRouter;
