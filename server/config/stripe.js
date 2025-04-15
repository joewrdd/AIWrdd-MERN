//----- Stripe Connection API -----
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });

console.log("Stripe API Key Available:", !!process.env.STRIPE_SECRET_KEY);

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-01-27.acacia",
  typescript: false,
});

module.exports = stripe;
