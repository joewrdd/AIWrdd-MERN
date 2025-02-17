import React, { useState } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useParams, useSearchParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { createStripePaymentIntent } from "../../apis/stripePaymentAPI";
import { FaSpinner, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

const CheckoutForm = () => {
  //----- Get Payloads -----
  const params = useParams();
  const [searchParams] = useSearchParams();
  const plan = params.plan;
  const rawAmount = searchParams.get("amount");
  const amount = rawAmount ? parseInt(rawAmount, 10) : 0;

  //---- Mutation -----
  const mutation = useMutation({
    mutationFn: createStripePaymentIntent,
    onError: (error) => {
      console.error("Payment intent creation failed:", error);
      setPaymentStatus("error");
      setErrorMessage(error.message || "Failed to create payment");
    },
  });

  //----- Stripe Configuration -----
  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState("idle");

  //----- Handle Submit -----
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) {
      return;
    }

    setPaymentStatus("loading");
    setErrorMessage(null);

    try {
      const { error: submitError } = await elements.submit();
      if (submitError) {
        console.error("Elements submit error:", submitError);
        setPaymentStatus("error");
        setErrorMessage(submitError.message);
        return;
      }

      const data = {
        amount,
        subscriptionPlan: plan,
      };

      const result = await mutation.mutateAsync(data);
      console.log("Payment intent created:", result);

      if (!result.clientSecret) {
        throw new Error("No client secret received");
      }

      // Update The "return_url" To Include Payment Intent-ID
      const { error: confirmError } = await stripe.confirmPayment({
        elements,
        clientSecret: result.clientSecret,
        confirmParams: {
          return_url: `${window.location.origin}/success?payment_intent=${result.paymentId}`,
          payment_method_data: {
            billing_details: {
              email: result.metadata.userEmail,
            },
          },
        },
      });

      if (confirmError) {
        console.error("Payment confirmation error:", confirmError);
        setPaymentStatus("error");
        setErrorMessage(confirmError.message);
      }
    } catch (error) {
      console.error("Payment error:", error);
      setPaymentStatus("error");
      setErrorMessage(error.message || "Payment failed");
    }
  };

  const renderButtonContent = () => {
    switch (paymentStatus) {
      case "loading":
        return (
          <div className="flex items-center justify-center">
            <FaSpinner className="animate-spin mr-2" />
            Processing...
          </div>
        );
      case "success":
        return (
          <div className="flex items-center justify-center">
            <FaCheckCircle className="mr-2" />
            Payment Successful
          </div>
        );
      case "error":
        return (
          <div className="flex items-center justify-center">
            <FaTimesCircle className="mr-2" />
            Payment Failed
          </div>
        );
      default:
        return "Pay Now";
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
      <form
        onSubmit={handleSubmit}
        className="max-w-md w-full bg-gray-800 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] p-8"
      >
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-center text-white mb-2">
            Complete Payment
          </h2>
          <p className="text-center text-gray-300 text-sm">
            Please enter your payment details to continue
          </p>
        </div>

        <div className="mb-3 bg-gray-600 p-6 rounded-xl">
          <PaymentElement />
        </div>

        <button
          type="submit"
          disabled={paymentStatus === "loading" || mutation.isLoading}
          className={`w-full py-3 px-4 rounded-xl text-sm font-medium text-white 
            ${
              paymentStatus === "loading" || mutation.isLoading
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-gradient-to-r from-[#432752] via-[#5a3470] to-[#6d4088] hover:opacity-90"
            } 
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#432752] 
            transition-all duration-200 transform hover:-translate-y-0.5`}
        >
          {renderButtonContent()}
        </button>

        {errorMessage && (
          <div className="text-red-400 mt-4 text-sm text-center flex items-center justify-center">
            <FaTimesCircle className="mr-2" />
            {errorMessage}
          </div>
        )}
      </form>
    </div>
  );
};

export default CheckoutForm;
