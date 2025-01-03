import axios from "axios";
import React, { useState, useEffect } from "react";
import { API } from "./API";

const predefinedMethods = [
    "LinkedIn Post",
    "LinkedIn Message",
    "Email",
    "Phone Call",
    "Other",
];

const CommunicationMethodManagement = () => {
    const [companies, setCompanies] = useState([]);
    const [methods, setMethods] = useState([]);
    const [newMethod, setNewMethod] = useState({
        name: "",
        description: "",
        sequence: "",
        mandatory: false,
        companyId: "",
    });
    const [selectedCompany, setSelectedCompany] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [methodsResponse, companiesResponse] = await Promise.all([
                    axios.get(`${API}/api/communication-methods`),
                    axios.get(`${API}/api/companies`),
                ]);
                setMethods(methodsResponse.data);
                setCompanies(companiesResponse.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewMethod({ ...newMethod, [name]: value });
    };

    const handleCheckboxChange = (e) => {
        setNewMethod({ ...newMethod, mandatory: e.target.checked });
    };

    const addOrUpdateMethod = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            if (newMethod._id) {
                const response = await axios.put(
                    `${API}/api/communication-methods/${newMethod._id}`,
                    newMethod
                );
                setMethods(methods.map((method) =>
                    method._id === response.data._id ? response.data : method
                ));
            } else {
                const response = await axios.post(
                    `${API}/api/communication-methods`,
                    newMethod
                );
                setMethods([...methods, response.data]);
            }
            resetForm();
        } catch (error) {
            console.error("Error adding/updating communication method:", error);
        } finally {
            setLoading(false);
        }
    };

    const deleteMethod = async (id) => {
        try {
            setLoading(true);
            await axios.delete(`${API}/api/communication-methods/${id}`);
            setMethods(methods.filter((method) => method._id !== id));
        } catch (error) {
            console.error("Error deleting communication method:", error);
        } finally {
            setLoading(false);
        }
    };

    const editMethod = (method) => {
        setNewMethod(method);
        setSelectedCompany(method.companyId);
        setShowForm(true);
    };

    const resetForm = () => {
        setNewMethod({
            name: "",
            description: "",
            sequence: "",
            mandatory: false,
            companyId: "",
        });
        setSelectedCompany("");
        setShowForm(false);
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 lg:px-16">
            <h2 className="text-4xl font-bold text-teal-700 mb-6">Communication Method Management</h2>
            <button
                onClick={() => setShowForm(!showForm)}
                className="bg-teal-600 text-white px-5 py-3 rounded-lg hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-blue-400 mb-6 transition-all"
            >
                {showForm ? "Close Form" : "Add New Method"}
            </button>
            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
                </div>
            ) : (
                <>
                    {showForm && (
                        <form
                            onSubmit={addOrUpdateMethod}
                            className="grid gap-4 bg-white p-6 rounded-lg shadow-md"
                        >
                            <select
                                name="companyId"
                                value={selectedCompany}
                                onChange={(e) => {
                                    setSelectedCompany(e.target.value);
                                    setNewMethod({ ...newMethod, companyId: e.target.value });
                                }}
                                className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
                            >
                                <option value="">Select Company</option>
                                {companies.map((company) => (
                                    <option key={company._id} value={company._id}>
                                        {company.name}
                                    </option>
                                ))}
                            </select>
                            <input
                                type="text"
                                name="description"
                                placeholder="Description"
                                value={newMethod.description}
                                onChange={handleInputChange}
                                required
                                className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
                            />
                            <input
                                type="number"
                                name="sequence"
                                placeholder="Sequence"
                                value={newMethod.sequence}
                                onChange={handleInputChange}
                                required
                                max="5"
                                className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
                            />
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    name="mandatory"
                                    checked={newMethod.mandatory}
                                    onChange={handleCheckboxChange}
                                    className="mr-2 focus:outline-none focus:ring-2 focus:ring-teal-400"
                                />
                                Mandatory
                            </label>
                            <select
                                name="name"
                                value={newMethod.name}
                                onChange={handleInputChange}
                                required
                                className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
                            >
                                <option value="">Select Communication Method</option>
                                {predefinedMethods.map((method, index) => (
                                    <option key={index} value={method}>
                                        {method}
                                    </option>
                                ))}
                            </select>
                            <button
                                type="submit"
                                className="bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-400 transition-all"
                            >
                                {newMethod._id ? "Update Method" : "Add Method"}
                            </button>
                        </form>
                    )}
                    <h3 className="text-xl font-bold mb-4 text-teal-700">Existing Methods</h3>
                    <div className="overflow-x-auto bg-white rounded-lg shadow-md">
                        <table className="min-w-full border border-gray-300">
                            <thead className="bg-teal-600 text-white">
                                <tr>
                                    <th className="px-6 py-3 text-left text-sm font-medium">
                                        Communication Method
                                    </th>
                                    <th className="px-6 py-3 text-left text-sm font-medium">
                                        Description
                                    </th>
                                    <th className="px-6 py-3 text-left text-sm font-medium">
                                        Sequence
                                    </th>
                                    <th className="px-6 py-3 text-left text-sm font-medium">
                                        Mandatory
                                    </th>
                                    <th className="px-6 py-3 text-left text-sm font-medium">
                                        Company
                                    </th>
                                    <th className="px-6 py-3 text-center text-sm font-medium">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {methods.map((method) => (
                                    <tr key={method._id} className="border-t hover:bg-gray-50">
                                        <td className="px-6 py-3 text-sm">{method.name}</td>
                                        <td className="px-6 py-3 text-sm">{method.description}</td>
                                        <td className="px-6 py-3 text-sm">{method.sequence}</td>
                                        <td className="px-6 py-3 text-sm">
                                            {method.mandatory ? "Yes" : "No"}
                                        </td>
                                        <td className="px-6 py-3 text-sm">
                                            {companies.find((company) => company._id === method.companyId)?.name || "N/A"}
                                        </td>
                                        <td className="px-6 py-3 text-center">
                                            <button
                                                onClick={() => editMethod(method)}
                                                className="bg-yellow-400 text-white px-3 py-1 rounded-lg hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-teal-400 mr-2 transition-all"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => deleteMethod(method._id)}
                                                className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-teal-400 transition-all"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </div>
    );
};

export default CommunicationMethodManagement;
