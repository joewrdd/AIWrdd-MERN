import { Link } from "react-router-dom";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { profileAPI } from "../../apis/usersAPI";
import StatusMessage from "../Alert/StatusMessage";

const Dashboard = () => {
  const { isLoading, isError, data, error } = useQuery({
    queryFn: profileAPI,
    queryKey: ["profile"],
    refetchOnWindowFocus: true,
    staleTime: 0,
    cacheTime: 0,
  });

  //----- Loading If User Exists -----
  if (isLoading) {
    return <StatusMessage type="loading" message="Loading please wait..." />;
  }

  //----- Check For Error -----
  if (isError) {
    return (
      <StatusMessage
        type="error"
        message={error?.response?.data?.message || "Error loading profile"}
      />
    );
  }

  const user = data?.user;

  if (!user) {
    return <StatusMessage type="error" message="No user data available" />;
  }

  return (
    <div className="mx-auto p-4 bg-gray-900 w-screen">
      <div className="flex items-center justify-center mb-8">
        <div className="bg-gradient-to-r from-[#301934] via-[#432752] to-[#5a3470] rounded-lg p-1">
          <div className="bg-gray-900 rounded-md px-6 py-2">
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#301934] via-[#432752] to-[#5a3470]">
              User Dashboard
            </h1>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Profile Section */}
        <div className="mb-6 bg-gradient-to-br from-white to-gray-50 p-6 shadow-lg rounded-xl border border-gray-100">
          <div className="flex items-center mb-6">
            <div className="p-2 bg-blue-50 rounded-lg mr-3">
              <svg
                className="w-6 h-6 text-blue-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                ></path>
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-800">
              Profile Information
            </h2>
          </div>
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
              <label
                className="block text-gray-600 text-sm font-medium mb-1"
                htmlFor="username"
              >
                Name
              </label>
              <p className="text-gray-800 font-semibold" id="username">
                {user?.username}
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
              <label
                className="block text-gray-600 text-sm font-medium mb-1"
                htmlFor="email"
              >
                Email
              </label>
              <p className="text-gray-800 font-semibold" id="email">
                {user?.email}
              </p>
            </div>
          </div>
        </div>

        {/* Credit Usage Section */}
        <div className="mb-6 bg-gradient-to-br from-white to-gray-50 p-6 shadow-lg rounded-xl border border-gray-100">
          <div className="flex items-center mb-6">
            <div className="p-2 bg-green-50 rounded-lg mr-3">
              <svg
                className="w-6 h-6 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                ></path>
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-800">
              Credit Usage
            </h2>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-gray-100 shadow-sm">
              <span className="text-gray-600">Monthly Credit</span>
              <span className="font-semibold text-gray-800">
                {user?.monthlyRequestCount}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-gray-100 shadow-sm">
              <span className="text-gray-600">Credit Used</span>
              <span className="font-semibold text-gray-800">
                {user?.apiRequestCount}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-gray-100 shadow-sm">
              <span className="text-gray-600">Credit Remaining</span>
              <span className="font-semibold text-gray-800">
                {user?.monthlyRequestCount - user?.apiRequestCount}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-gray-100 shadow-sm">
              <span className="text-gray-600">Next Billing Date</span>
              <span className="font-semibold text-gray-800">
                {user?.nextBillingDate
                  ? user?.nextBillingDate
                  : "No Billing Date"}
              </span>
            </div>
          </div>
        </div>

        {/* Payment and Plans Section */}
        <div className="mb-6 bg-gradient-to-br from-white to-gray-50 p-6 shadow-lg rounded-xl border border-gray-100">
          <div className="flex items-center mb-6">
            <div className="p-2 bg-purple-50 rounded-lg mr-3">
              <svg
                className="w-6 h-6 text-purple-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                ></path>
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-800">
              Payment & Plans
            </h2>
          </div>
          <div className="space-y-4">
            <div className="p-4 bg-white rounded-lg border border-gray-100 shadow-sm">
              <p className="text-gray-600 mb-4">
                Current Plan:{" "}
                <span className="font-semibold text-gray-800">
                  {user?.subscription || "No Plan"}
                </span>
              </p>
              {user?.subscription === "Trial" && (
                <p className="border mb-2 rounded w-full py-2 px-3 text-gray-700 leading-tight">
                  Trial: 25 Monthly Requests
                </p>
              )}
              {user?.subscription === "Free" && (
                <p className="border mb-2 rounded w-full py-2 px-3 text-gray-700 leading-tight">
                  Free: 5 Monthly Requests
                </p>
              )}
              {user?.subscription === "Basic" && (
                <p className="border mb-2 rounded w-full py-2 px-3 text-gray-700 leading-tight">
                  Basic: 50 Monthly Requests
                </p>
              )}
              {user?.subscription === "Premium" && (
                <p className="border mb-2 rounded w-full py-2 px-3 text-gray-700 leading-tight">
                  Premium: 100 Monthly Requests
                </p>
              )}
              {user?.subscription !== "Premium" && (
                <Link
                  to="/plans"
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-[#301934] via-[#432752] to-[#5a3470] hover:shadow-lg hover:opacity-95 transition-all duration-300"
                >
                  Upgrade Plan
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Trial Information Section */}
        <div className="mb-6 bg-gradient-to-br from-white to-gray-50 p-6 shadow-lg rounded-xl border border-gray-100">
          <div className="flex items-center mb-6">
            <div className="p-2 bg-yellow-50 rounded-lg mr-3">
              <svg
                className="w-6 h-6 text-yellow-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-800">
              Trial Information
            </h2>
          </div>
          <div className="space-y-4">
            <div className="p-4 bg-white rounded-lg border border-gray-100 shadow-sm">
              <p className="text-gray-600 mb-2">
                Trial Status:{" "}
                <span className="font-semibold text-gray-800">
                  {user?.payments?.some(
                    (payment) => payment.status === "Succeeded"
                  ) ? (
                    <span className="text-green-500">
                      Upgraded To {user?.subscription}
                    </span>
                  ) : (
                    <span
                      className={
                        user?.trialActive ? "text-green-500" : "text-red-600"
                      }
                    >
                      {user?.trialActive ? "Active" : "Inactive"}
                    </span>
                  )}
                </span>
              </p>
              {user?.payments?.some(
                (payment) => payment.status === "Succeeded"
              ) ? (
                <p className="text-gray-600 mb-4">
                  Next Billing Date:{" "}
                  <span className="font-semibold text-gray-800">
                    {new Date(user?.nextBillingDate).toDateString()}
                  </span>
                </p>
              ) : (
                <p className="text-gray-600 mb-4">
                  Trial Expires on:{" "}
                  <span className="font-semibold text-gray-800">
                    {new Date(user?.trialExpires).toDateString()}
                  </span>
                </p>
              )}
              {user?.subscription !== "Premium" && (
                <Link
                  to="/plans"
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-[#301934] via-[#432752] to-[#5a3470] hover:shadow-lg hover:opacity-95 transition-all duration-300"
                >
                  Upgrade to Premium
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* History Section */}
        <div className="mb-6 bg-gradient-to-br from-white to-gray-50 p-6 shadow-lg rounded-xl border border-gray-100 col-span-1 md:col-span-2">
          <div className="flex items-center mb-6">
            <div className="p-2 bg-indigo-50 rounded-lg mr-3">
              <svg
                className="w-6 h-6 text-indigo-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                ></path>
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-800">
              Payment History
            </h2>
          </div>
          {user?.payments?.length > 0 ? (
            <ul className="divide-y divide-gray-100">
              {/* Example History Item */}
              {user?.payments?.map((payment) => (
                <li
                  key={payment._id}
                  className="py-4 px-4 hover:bg-gray-50 rounded-lg transition duration-150 ease-in-out"
                >
                  <div className="flex flex-col sm:flex-row justify-between">
                    <div className="mb-2 sm:mb-0">
                      <p className="text-sm font-medium text-indigo-600">
                        {payment?.subscriptionPlan}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(payment?.createdAt).toDateString()}
                      </p>
                    </div>
                    <div className="flex items-center">
                      <span
                        className={`px-2.5 py-1 text-xs font-semibold ${
                          payment?.status === "Succeeded"
                            ? "text-green-700"
                            : "text-orange-500"
                        }`}
                      >
                        {payment?.status}
                      </span>
                      <p className="text-sm font-semibold text-gray-700">
                        ${payment?.amount}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <h1>No Payment History</h1>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
