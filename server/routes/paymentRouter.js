const express = require("express");
const isAuthenticated = require("../middlewares/isAuthenticated");
const {
  handleStripePayment,
  handleFreeSubscription,
  verifyPayment,
  handleStripeWebhook,
  updateSubscription,
} = require("../controllers/paymentController");

const paymentRouter = express.Router();

// Place webhook route first to ensure it gets raw body
paymentRouter.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  handleStripeWebhook
);

//----- Handles All Payment Required Routes -----
paymentRouter.post("/checkout", isAuthenticated, handleStripePayment);
paymentRouter.post("/free-plan", isAuthenticated, handleFreeSubscription);
paymentRouter.post(
  "/verify-payment/:paymentId",
  isAuthenticated,
  verifyPayment
);
paymentRouter.post("/update-subscription", isAuthenticated, updateSubscription);

module.exports = paymentRouter;
