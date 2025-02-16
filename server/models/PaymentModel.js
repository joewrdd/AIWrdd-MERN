const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    reference: {
      type: String,
      required: true,
    },
    currency: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ["Pending", "Succeeded", "Failed"],
    },
    subscriptionPlan: {
      type: String,
      required: true,
      enum: ["Free", "Basic", "Premium"],
    },
    amount: {
      type: Number,
      required: true,
    },
    monthlyRequestCount: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const PaymentModel = mongoose.model("Payment", paymentSchema);

module.exports = PaymentModel;
