import React from "react";
import { useSearchParams } from "react-router-dom";
import { FaSpinner } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import { verifyPayment } from "../../apis/stripePaymentAPI";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const paymentIntentID = searchParams.get("payment_intent");

  const { data } = useQuery({
    queryFn: () => verifyPayment(paymentIntentID),
  });
  console.log(data);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="text-center text-white">
        <FaSpinner className="animate-spin text-4xl mx-auto mb-4" />
        <p>Verifying your payment...</p>
      </div>
    </div>
  );
};

export default PaymentSuccess;
