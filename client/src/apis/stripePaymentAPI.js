import axios from "axios";
import config from "../config";

const API_URL = config.API_URL;

//----- Stripe Payment -----
export const handleFreeSubscription = async () => {
  const response = await axios.post(
    `${API_URL}/api/stripe/free-plan`,
    {},
    {
      withCredentials: true,
    }
  );
  return response?.data;
};

//----- Stripe Payment Intent -----
export const createStripePaymentIntent = async (payment) => {
  console.log(payment);
  const response = await axios.post(
    `${API_URL}/api/stripe/checkout`,
    {
      amount: Number(payment?.amount),
      subscriptionPlan: payment?.subscriptionPlan,
    },
    {
      withCredentials: true,
    }
  );
  return response?.data;
};

//----- Verify Payment Intent -----
export const verifyPayment = async (paymentId) => {
  if (!paymentId) {
    throw new Error("Payment ID is required");
  }

  try {
    console.log("Verifying payment:", paymentId);
    const response = await axios.post(
      `${API_URL}/api/stripe/verify-payment/${paymentId}`,
      {},
      {
        withCredentials: true,
      }
    );

    //----- Update User => Unavailable Hook ------
    if (response.data.paymentStatus === "succeeded") {
      try {
        await axios.post(
          `${API_URL}/api/stripe/update-subscription`,
          { paymentId },
          { withCredentials: true }
        );
      } catch (updateError) {
        console.error("Failed to update subscription:", updateError);
      }
    }

    return response?.data;
  } catch (error) {
    console.error("Verification Error:", error.response?.data || error.message);
    throw error;
  }
};
