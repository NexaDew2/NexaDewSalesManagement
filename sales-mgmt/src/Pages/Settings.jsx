"use client"

import React, { useState, useEffect } from 'react';
import Header from '../components/Header/Header';
import { db } from '../firebase/firebase';
import { collection, getDocs, query, orderBy, doc, updateDoc } from 'firebase/firestore';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('Business Info'); // Default to Employee Details
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingEmployeeId, setEditingEmployeeId] = useState(null);
  const [newRole, setNewRole] = useState('');

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const collections = ["companyOwner", "marketingManager", "salesManager"];
      let allEmployees = [];

      // Fetch data from each collection
      for (const collectionName of collections) {
        const q = query(collection(db, collectionName), orderBy("name", "asc"));
        const querySnapshot = await getDocs(q);
        const employeesData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          collection: collectionName, 
          ...doc.data(),
        }));
        allEmployees = [...allEmployees, ...employeesData];
      }

      setEmployees(allEmployees);
    } catch (error) {
      console.error("Error fetching employees:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (employee) => {
    setEditingEmployeeId(employee.id);
    setNewRole(employee.role); // Pre-fill the current role
  };

  const handleRoleChange = async (employeeId, currentCollection) => {
    try {
      // Map the new role to the corresponding collection
      const roleToCollectionMap = {
        "Company Owner": "companyOwner",
        "Marketing Manager": "marketingManager",
        "Sales Manager": "salesManager",
      };
      const newCollection = roleToCollectionMap[newRole];

      if (!newCollection) {
        throw new Error("Invalid role selected");
      }
      const employee = employees.find(emp => emp.id === employeeId && emp.collection === currentCollection);
      if (!employee) {
        throw new Error("Employee not found");
      }
      if (currentCollection === newCollection) {
        setEditingEmployeeId(null);
        return;
      }
      const oldDocRef = doc(db, currentCollection, employeeId);
      await updateDoc(oldDocRef, { role: newRole }); // Update role in current collection
      setEditingEmployeeId(null);
      await fetchEmployees();
    } catch (error) {
      console.error("Error updating employee role:", error);
    }
  };

  const tabs = [
    "Business Info",
    "WhatsApp Template",
    "Notification Preferences",
    "Employee Details",
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "Business Info":
        return (
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Business Info</h2>
            <p className="text-gray-600">Configure your business information here.</p>
            {/* Add form fields for business info if needed */}
          </div>
        );
      case "WhatsApp Template":
        return (
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">WhatsApp Template</h2>
            <p className="text-gray-600">Manage your WhatsApp templates here.</p>
            {/* Add template management UI if needed */}
          </div>
        );
      case "Notification Preferences":
        return (
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Notification Preferences</h2>
            <p className="text-gray-600">Set your notification preferences here.</p>
            {/* Add notification settings UI if needed */}
          </div>
        );
      case "Employee Details":
        return (
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Employee Details</h2>
            {loading ? (
              <div className="text-center text-gray-600">Loading employees...</div>
            ) : employees.length === 0 ? (
              <div className="text-center text-gray-600">No employees found.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {employees.map((employee) => (
                      <tr key={`${employee.collection}-${employee.id}`} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {employee.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {employee.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {editingEmployeeId === employee.id ? (
                            <select
                              value={newRole}
                              onChange={(e) => setNewRole(e.target.value)}
                              className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                              <option value="Company Owner">Company Owner</option>
                              <option value="Marketing Manager">Marketing Manager</option>
                              <option value="Sales Manager">Sales Manager</option>
                            </select>
                          ) : (
                            employee.role
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {editingEmployeeId === employee.id ? (
                            <div className="flex gap-2">
                              <button
                                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                                onClick={() => handleRoleChange(employee.id, employee.collection)}
                              >
                                Save
                              </button>
                              <button
                                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                                onClick={() => setSetEditingEmployeeId(null)}
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button
                              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                              onClick={() => handleEditClick(employee)}
                            >
                              Edit
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Settings</h1>
        <div className="mb-6">
          <ul className="flex gap-6 border-b border-gray-200">
            {tabs.map((tab) => (
              <li
                key={tab}
                className={`pb-2 cursor-pointer ${
                  activeTab === tab
                    ? 'border-b-2 border-blue-500 text-blue-500 font-semibold'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </li>
            ))}
          </ul>
        </div>
        {renderTabContent()}
      </div>
    </div>
  );
};

export default Settings;