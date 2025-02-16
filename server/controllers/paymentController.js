const asyncHandler = require("express-async-handler");
const {
  calculateNextBillingDate,
} = require("../utils/calculateNextBillingDate");
const { shouldRenewSubscriptionPlan } = require("../utils/shouldRenewPlan");
const stripe = require("../config/stripe");

const PaymentModel = require("../models/PaymentModel");
const UserModel = require("../models/UserModel");

//----- Stripe Payment -----
const handleStripePayment = asyncHandler(async (req, res) => {
  const { amount, subscriptionPlan } = req.body;
  const user = req?.user;

  if (!user?._id) {
    return res.status(401).json({
      status: false,
      message: "User not authenticated",
    });
  }

  try {
    // Create payment intent with explicit subscription data
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Number(amount) * 100, // Convert to cents
      currency: "usd",
      metadata: {
        userId: user?._id?.toString(),
        userEmail: user?.email,
        subscriptionPlan,
      },
    });

    // Sending Response
    res.json({
      clientSecret: paymentIntent?.client_secret,
      paymentId: paymentIntent?.id,
      metadata: paymentIntent?.metadata,
    });
  } catch (error) {
    console.error("Payment intent creation error:", error);
    res.status(500).json({
      error: error.message,
    });
  }
});

//----- Payment Verification -----
const verifyPayment = asyncHandler(async (req, res) => {
  const { paymentId } = req.params;
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentId);
    console.log(paymentIntent);
    if (paymentIntent.status === "succeeded") {
      // Get The MetaData Information
      const metadata = paymentIntent?.metadata;
      const subscriptionPlan = metadata?.subscriptionPlan;
      const userEmail = metadata?.userEmail;
      const userId = metadata?.userId;

      // Find User
      const userFound = await User.findById(userId);
      if (!userFound) {
        return res.status(404).json({
          status: "false",
          message: "User not found",
        });
      }
      // Get The Payment Details
      const amount = paymentIntent?.amount / 100;
      const currency = paymentIntent?.currency;
      const paymentId = paymentIntent?.id;

      // Create The Payment History
      const newPayment = await Payment.create({
        user: userId,
        email: userEmail,
        subscriptionPlan,
        amount,
        currency,
        status: "success",
        reference: paymentId,
      });

      // Check For The Subscription Plan

      if (subscriptionPlan === "Basic") {
        // Update The User For Basic Access
        const updatedUser = await User.findByIdAndUpdate(userId, {
          subscriptionPlan,
          trialPeriod: 0,
          nextBillingDate: calculateNextBillingDate(),
          apiRequestCount: 0,
          monthlyRequestCount: 50,
          subscriptionPlan: "Basic",
          $addToSet: { payments: newPayment?._id },
        });

        res.json({
          status: true,
          message: "Payment verified, user updated",
          updatedUser,
        });
      }
      if (subscriptionPlan === "Premium") {
        // Update The User For Premium Access
        const updatedUser = await User.findByIdAndUpdate(userId, {
          subscriptionPlan,
          trialPeriod: 0,
          nextBillingDate: calculateNextBillingDate(),
          apiRequestCount: 0,
          monthlyRequestCount: 100,
          subscriptionPlan: "Premium",
          $addToSet: { payments: newPayment?._id },
        });

        res.json({
          status: true,
          message: "Payment verified, user updated",
          updatedUser,
        });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
});

//----- Handling Free Subscription -----
const handleFreeSubscription = asyncHandler(async (req, res) => {
  const user = req?.user;

  try {
    if (shouldRenewSubscriptionPlan(user)) {
      user.subscription = "Free";
      user.monthlyRequestCount = 5;
      user.apiRequestCount = 0;
      user.nextBillingDate = calculateNextBillingDate();

      // New Payment => DB
      const newPayment = await PaymentModel.create({
        user: user?._id,
        subscriptionPlan: "Free",
        amount: 0,
        monthlyRequestCount: 5,
        currency: "usd",
        status: "success",
        reference: Math.random().toString(36).substring(7),
      });

      user.payments.push(newPayment?._id);
      await user.save();

      res.json({
        status: "success",
        message: "Subscription Plan Updated Successfully!",
        user,
      });
    } else {
      return res
        .status(403)
        .json({ error: "Subscription Renewal Not Due Yet." });
    }
  } catch (error) {
    console.error("Free subscription error:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = {
  handleStripePayment,
  handleFreeSubscription,
  verifyPayment,
};

// Cron: In Node.js cron is a module that allows us to schedule task to be executed at specific times or intervals
