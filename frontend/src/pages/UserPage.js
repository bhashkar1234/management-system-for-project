import React from "react";
import { Link } from "react-router-dom";

const UserPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">User Options</h1>
      <div className="flex flex-wrap justify-center gap-6">
        <Link
          to="/notifications"
          className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6 w-64 text-center border border-gray-200 hover:bg-gray-50"
        >
          <h2 className="text-xl font-semibold text-gray-700">Notifications</h2>
          <p className="text-gray-500 mt-2">View your notifications here.</p>
        </Link>
        <Link
          to="/dashboard"
          className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6 w-64 text-center border border-gray-200 hover:bg-gray-50"
        >
          <h2 className="text-xl font-semibold text-gray-700">Dashboard</h2>
          <p className="text-gray-500 mt-2">Access your dashboard.</p>
        </Link>
        <Link
          to="/log-communication"
          className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6 w-64 text-center border border-gray-200 hover:bg-gray-50"
        >
          <h2 className="text-xl font-semibold text-gray-700">Log Communication</h2>
          <p className="text-gray-500 mt-2">Manage your logs.</p>
        </Link>
      </div>
    </div>
  );
};

export default UserPage;
