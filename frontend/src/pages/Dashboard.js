import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API } from './API';

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
                setError('Failed to fetch dashboard data.');
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 p-8">
            <h1 className="text-4xl font-extrabold mb-8 text-gray-800 text-center">Dashboard</h1>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
                    <p className="text-blue-500 ml-4 font-semibold">Loading data...</p>
                </div>
            ) : error ? (
                <div className="bg-red-100 text-red-700 border border-red-300 rounded-md p-4 text-center">
                    {error}
                </div>
            ) : dashboardData.length > 0 ? (
                <div className="overflow-x-auto shadow-2xl rounded-xl bg-white p-6">
                    <table className="min-w-full border-collapse bg-white rounded-lg">
                        <thead>
                            <tr className="bg-teal-600 text-white">
                                <th className="px-6 py-4 text-left text-sm font-semibold tracking-wide">Company Name</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold tracking-wide">Last 5 Communications</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold tracking-wide">Next Scheduled Communication</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dashboardData.map((company, index) => (
                                <tr
                                    key={index}
                                    className={`hover:bg-gray-100 transition duration-200 ${
                                        index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                                    }`}
                                >
                                    <td className="px-6 py-4 text-sm text-gray-800">
                                        {company.companyName || 'No Name'}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-800">
                                        {company.lastFiveCommunications.length > 0 ? (
                                            <ul className="list-disc pl-4">
                                                {company.lastFiveCommunications.map((comm, idx) => (
                                                    <li key={idx} className="py-1">
                                                        <span className="font-semibold text-teal-600">{comm.type}</span> - {comm.date || 'No Date'}
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p className="text-gray-500 italic">No communications available</p>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-800">
                                        {company.nextScheduledCommunication ? (
                                            <span className="font-semibold text-teal-600">
                                                {company.nextScheduledCommunication.type} - {company.nextScheduledCommunication.date || 'No Date'}
                                            </span>
                                        ) : (
                                            <p className="text-gray-500 italic">No scheduled communication</p>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p className="text-center text-gray-600 text-lg italic">No data available</p>
            )}
        </div>
    );
};

export default Dashboard;
