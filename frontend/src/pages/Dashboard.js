import React, { useEffect, useState } from "react";
import axios from "axios";
import { API } from "./API";

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axios.get(`${API}/api/dashboard`);
        setDashboardData(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch dashboard data.");
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-8">
      <h1 className="text-5xl font-bold text-white text-center mb-8 shadow-md">
        Dashboard
      </h1>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-yellow-300 shadow-lg"></div>
          <p className="text-yellow-200 ml-4 font-semibold text-lg">
            Loading data...
          </p>
        </div>
      ) : error ? (
        <div className="bg-red-100 text-red-800 border border-red-400 rounded-lg p-4 text-center shadow-lg">
          {error}
        </div>
      ) : dashboardData.length > 0 ? (
        <div className="overflow-x-auto shadow-2xl rounded-xl bg-white p-6">
          <table className="min-w-full border-collapse border border-gray-300 rounded-lg">
            <thead>
              <tr className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
                <th className="px-6 py-4 text-left text-sm font-bold tracking-wide">
                  Company Name
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold tracking-wide">
                  Last 5 Communications
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold tracking-wide">
                  Next Scheduled Communication
                </th>
              </tr>
            </thead>
            <tbody>
              {dashboardData.map((company, index) => (
                <tr
                  key={index}
                  className={`transition duration-300 ${
                    index % 2 === 0 ? "bg-gray-100" : "bg-gray-50"
                  } hover:bg-purple-200 hover:shadow-lg`}
                >
                  <td className="px-6 py-4 text-sm text-gray-800 font-medium">
                    {company.companyName || "No Name"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {company.lastFiveCommunications.length > 0 ? (
                      <ul className="list-disc pl-4 space-y-1">
                        {company.lastFiveCommunications.map((comm, idx) => (
                          <li key={idx} className="hover:text-purple-600">
                            <span className="font-semibold text-blue-600">
                              {comm.type}
                            </span>{" "}
                            - {comm.date || "No Date"}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-500 italic">
                        No communications available
                      </p>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {company.nextScheduledCommunication ? (
                      <span className="font-semibold text-blue-600 hover:text-purple-600">
                        {company.nextScheduledCommunication.type} -{" "}
                        {company.nextScheduledCommunication.date || "No Date"}
                      </span>
                    ) : (
                      <p className="text-gray-500 italic">
                        No scheduled communication
                      </p>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center text-white text-lg italic">
          No data available
        </p>
      )}
    </div>
  );
};

export default Dashboard;
