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
    // Creating Payment Intent With Explicit Subscription Data
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Number(amount) * 100,
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
    res.json({
      status: true,
      paymentStatus: paymentIntent.status,
    });
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

//----- Handles Stripe WebHook Event -----
const handleStripeWebhook = asyncHandler(async (req, res) => {
  const sig = req.headers["stripe-signature"];

  try {
    const event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    // Handles Successful Payment
    if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object;

      // Get The MetaData Information
      const metadata = paymentIntent?.metadata;
      const subscriptionPlan = metadata?.subscriptionPlan;
      const userEmail = metadata?.userEmail;
      const userId = metadata?.userId;

      // Find User
      const userFound = await UserModel.findById(userId);
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
      const newPayment = await PaymentModel.create({
        user: userId,
        email: userEmail,
        subscriptionPlan,
        amount,
        currency,
        status: "Succeeded",
        reference: paymentId,
        monthlyRequestCount: subscriptionPlan === "Basic" ? 50 : 100,
      });

      // Updates User Subscription Plan
      const updateData = {
        subscription: subscriptionPlan,
        trialPeriod: 0,
        trialActive: false,
        nextBillingDate: calculateNextBillingDate(),
        apiRequestCount: 0,
        monthlyRequestCount: subscriptionPlan === "Basic" ? 50 : 100,
        $addToSet: { payments: newPayment?._id },
      };

      await UserModel.findByIdAndUpdate(userId, updateData);
    }

    res.json({ received: true });
  } catch (err) {
    console.error("Webhook error:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
});

//----- Update Subscription -----
const updateSubscription = asyncHandler(async (req, res) => {
  const { paymentId } = req.body;
  const user = req.user;

  try {
    // Retrieve Payment Intent From Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentId);

    if (paymentIntent.status === "succeeded") {
      const metadata = paymentIntent.metadata;
      const subscriptionPlan = metadata.subscriptionPlan;

      // Create Payment Record
      const newPayment = await PaymentModel.create({
        user: user._id,
        email: user.email,
        subscriptionPlan,
        amount: paymentIntent.amount / 100,
        currency: paymentIntent.currency,
        status: "Succeeded",
        reference: paymentId,
        monthlyRequestCount: subscriptionPlan === "Basic" ? 50 : 100,
      });

      // Update User Data
      const updateData = {
        subscription: subscriptionPlan,
        trialPeriod: 0,
        trialActive: false,
        nextBillingDate: calculateNextBillingDate(),
        apiRequestCount: 0,
        monthlyRequestCount: subscriptionPlan === "Basic" ? 50 : 100,
        $addToSet: { payments: newPayment._id },
      };

      const updatedUser = await UserModel.findByIdAndUpdate(
        user._id,
        updateData,
        { new: true }
      );

      res.json({
        status: "success",
        message: "Subscription updated",
        user: updatedUser,
      });
    } else {
      res
        .status(400)
        .json({ status: "error", message: "Payment not successful" });
    }
  } catch (error) {
    console.error("Update subscription error:", error);
    res.status(500).json({ status: "error", message: error.message });
  }
});

module.exports = {
  handleStripePayment,
  handleFreeSubscription,
  verifyPayment,
  handleStripeWebhook,
  updateSubscription,
};
