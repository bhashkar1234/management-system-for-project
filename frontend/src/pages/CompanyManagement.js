import React, { useState, useEffect } from "react";
import axios from "axios";
import { API } from "./API";

const CompanyManagement = () => {
  const [companies, setCompanies] = useState([]);
  const [newCompany, setNewCompany] = useState({
    name: "",
    location: "",
    linkedin: "",
    emails: "",
    phoneNumbers: "",
    comments: "",
    periodicity: "",
  });
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingCompany, setEditingCompany] = useState({});
  const [isFormVisible, setIsFormVisible] = useState(false);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        const response = await axios.get(`${API}/api/companies`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCompanies(response.data || []);
      } catch (error) {
        console.error(
          "Error fetching companies:",
          error.response ? error.response.data : error.message
        );
      }
    };
    fetchCompanies();
  }, [newCompany]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (editingIndex !== null) {
      setEditingCompany({ ...editingCompany, [name]: value });
    } else {
      setNewCompany({ ...newCompany, [name]: value });
    }
  };

  const addCompany = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("adminToken");
      const response = await axios.post(`${API}/api/companies`, newCompany, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCompanies([...companies, response.data]);
      setNewCompany({
        name: "",
        location: "",
        linkedin: "",
        emails: "",
        phoneNumbers: "",
        comments: "",
        periodicity: "",
      });
      setIsFormVisible(false);
    } catch (error) {
      console.error("Error adding company:", error.response?.data || error.message);
    }
  };

  const editCompany = (index) => {
    setEditingIndex(index);
    setEditingCompany(companies[index]);
    setIsFormVisible(true);
  };

  const updateCompany = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `${API}/api/companies/${editingCompany._id}`,
        editingCompany
      );
      const updatedCompanies = companies.map((company, index) =>
        index === editingIndex ? response.data : company
      );
      setCompanies(updatedCompanies);
      setEditingIndex(null);
      setEditingCompany({});
      setIsFormVisible(false);
    } catch (error) {
      console.error("Error updating company:", error.response?.data || error.message);
    }
  };

  const deleteCompany = async (id) => {
    try {
      await axios.delete(`${API}/api/companies/${id}`);
      setCompanies(companies.filter((company) => company._id !== id));
    } catch (error) {
      console.error("Error deleting company:", error.response?.data || error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-teal-100 p-6">
      <div className="max-w-7xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-extrabold text-gray-800 mb-6">
          Company Management
        </h2>
        <button
          onClick={() => setIsFormVisible(!isFormVisible)}
          className="bg-teal-600 text-white px-6 py-3 rounded-lg mb-4 hover:bg-teal-700 transition focus:ring-4 focus:ring-teal-300"
        >
          {isFormVisible ? "Hide Form" : "Add Company"}
        </button>
        {isFormVisible && (
          <form
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6"
            onSubmit={editingIndex !== null ? updateCompany : addCompany}
          >
            {Object.keys(newCompany).map((key) => (
              <input
                key={key}
                className="p-4 border border-gray-300 rounded-lg shadow-sm focus:ring-4 focus:ring-blue-200"
                type={key === "linkedin" ? "url" : "text"}
                name={key}
                placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
                value={
                  editingIndex !== null ? editingCompany[key] : newCompany[key]
                }
                onChange={handleInputChange}
              />
            ))}
            <button
              type="submit"
              className="col-span-full bg-blue-600 text-white p-4 rounded-lg hover:bg-blue-700 transition focus:ring-4 focus:ring-blue-300"
            >
              {editingIndex !== null ? "Update Company" : "Add Company"}
            </button>
          </form>
        )}
        <div className="overflow-x-auto">
          <table className="table-auto w-full bg-white shadow rounded-lg border-collapse">
            <thead>
              <tr className="bg-teal-600 text-white">
                {["Name", "Location", "LinkedIn", "Emails", "Phone Numbers", "Comments", "Periodicity", "Actions"].map(
                  (heading) => (
                    <th key={heading} className="px-4 py-2">
                      {heading}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {companies.map((company, index) => (
                <tr
                  key={company._id}
                  className="border-b border-gray-200 hover:bg-teal-50 transition"
                >
                  <td className="px-4 py-2">{company.name}</td>
                  <td className="px-4 py-2">{company.location}</td>
                  <td className="px-4 py-2">
                    <a
                      href={company.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      LinkedIn
                    </a>
                  </td>
                  <td className="px-4 py-2">{company.emails}</td>
                  <td className="px-4 py-2">{company.phoneNumbers}</td>
                  <td className="px-4 py-2">{company.comments}</td>
                  <td className="px-4 py-2">{company.periodicity}</td>
                  <td className="px-4 py-2 space-x-2">
                    <button
                      onClick={() => editCompany(index)}
                      className="text-teal-600 hover:text-teal-800"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteCompany(company._id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CompanyManagement;
