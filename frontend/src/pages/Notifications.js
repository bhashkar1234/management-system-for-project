import React, { useState, useEffect } from "react";
import axios from "axios";
import { API } from "./API";
const Notifications = () => {
  const [overdue, setOverdue] = useState([]);
  const [todays, setTodays] = useState([]);
  const [counts, setCounts] = useState({ overdue: 0, todays: 0 });

  useEffect(() => {
    const fetchCommunicationTypes = async () => {
      try {
        const response = await axios.get(`${API}/api/communication-methods`);
        const types = {};
        response.data.forEach((method) => {
          types[method._id] = method.name;
        });
        return types;
      } catch (error) {
        console.error("Error fetching communication types:", error);
        return {};
      }
    };

    const fetchCompanies = async () => {
      try {
        const response = await axios.get(`${API}/api/companies`);
        const companyMap = {};
        response.data.forEach((company) => {
          companyMap[company._id] = company.name;
        });
        return companyMap;
      } catch (error) {
        console.error("Error fetching companies:", error);
        return {};
      }
    };

    const fetchNotifications = async (types, companies) => {
      try {
        const response = await axios.get(`${API}/api/communications`);
        const communications = response.data;

        const now = new Date();
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        const companyCommunications = {};

        communications.forEach((comm) => {
          const lastCommDate = new Date(comm.lastDate);
          const companyId = comm.companyId;

          if (!companyCommunications[companyId]) {
            companyCommunications[companyId] = {
              company: companies[companyId] || "Unknown Company",
              overdue: [],
              todays: [],
            };
          }

          const commDetail = {
            name: comm.name || "Unnamed Communication",
            date: lastCommDate,
            notes: comm.notes || "No notes available",
            type: types[comm.type] || "Unknown Type",
          };

          if (lastCommDate < todayStart) {
            companyCommunications[companyId].overdue.push(commDetail);
          } else {
            companyCommunications[companyId].todays.push(commDetail);
          }
        });

        const overdue = [];
        const todays = [];

        Object.values(companyCommunications).forEach((group) => {
          if (group.overdue.length > 0) overdue.push(group);
          if (group.todays.length > 0) todays.push(group);
        });

        setOverdue(overdue);
        setTodays(todays);
        setCounts({
          overdue: overdue.reduce((acc, curr) => acc + curr.overdue.length, 0),
          todays: todays.reduce((acc, curr) => acc + curr.todays.length, 0),
        });

        const totalNotifications = overdue.length + todays.length;
        document.title =
          totalNotifications > 0
            ? `(${totalNotifications}) Notifications`
            : "Notifications";
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    const initializeData = async () => {
      const [types, companies] = await Promise.all([fetchCommunicationTypes(), fetchCompanies()]);
      fetchNotifications(types, companies);
    };

    initializeData();
  }, []); // Empty dependency array ensures the effect runs only once on mount.

  const renderGrid = (items, title, type) => (
    <div className="mb-8">
      <h3 className="text-xl font-semibold mb-4">{title}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => (
          <div
            key={item.company}
            className="p-4 bg-white rounded-lg shadow-lg"
          >
            <h4 className="font-bold text-gray-800 text-lg mb-2">
              {item.company}
            </h4>

            <div className="text-sm text-gray-500 mb-2">
              {type === "overdue" && item.overdue.length > 0 && (
                <div>
                  <h5 className="font-semibold text-red-600 mb-2">Overdue:</h5>
                  {item.overdue.map((comm, index) => (
                    <div key={index} className="mb-4">
                      <p className="font-semibold text-gray-800">{comm.type}</p>
                      <span className="text-gray-600">
                        {comm.date.toLocaleDateString()}
                      </span>
                      <p className="text-gray-600">{comm.notes}</p>
                      <p className="text-gray-500">Type: {comm.type}</p>
                    </div>
                  ))}
                </div>
              )}

              {type === "todays" && item.todays.length > 0 && (
                <div>
                  <h5 className="font-semibold text-green-600 mb-2">Today:</h5>
                  {item.todays.map((comm, index) => (
                    <div key={index} className="mb-4">
                      <p className="font-semibold text-gray-800">{comm.type}</p>
                      <span className="text-gray-600">
                        {comm.date.toLocaleDateString()}
                      </span>
                      <p className="text-gray-600">{comm.notes}</p>
                      <p className="text-gray-500">Type: {comm.type}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Notifications</h2>
      <div className="relative mb-6">
        <i className="fas fa-bell text-2xl text-gray-800"></i>
        {counts.overdue > 0 || counts.todays > 0 ? (
          <span className="absolute top-0 right-0 px-2 py-1 text-xs bg-red-600 text-white rounded-full">
            {counts.overdue + counts.todays}
          </span>
        ) : null}
      </div>
      {renderGrid(overdue, `Companies with Overdue Communications (${counts.overdue})`, "overdue")}
      {renderGrid(todays, `Companies with Today's Communications (${counts.todays})`, "todays")}
    </div>
  );
};

export default Notifications;
