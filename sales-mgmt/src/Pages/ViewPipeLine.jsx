"use client"

import { useState, useEffect } from "react"
import Header from "../components/Header/Header"
import { db } from "../firebase/firebase"
import { collection, getDocs, query, orderBy, doc, updateDoc } from "firebase/firestore"

const ViewPipeLine = () => {
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("All")
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    fetchLeads()
  }, [])

  const fetchLeads = async () => {
    try {
      const q = query(collection(db, "leads"), orderBy("createdAt", "desc"))
      const querySnapshot = await getDocs(q)
      const leadsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      setLeads(leadsData)
    } catch (error) {
      console.error("Error fetching leads:", error)
    } finally {
      setLoading(false)
    }
  }

  // Generic function to update lead status
  const handleStatusChange = async (leadId, newStatus) => {
    try {
      const leadRef = doc(db, "leads", leadId)
      await updateDoc(leadRef, { status: newStatus })
      // Refresh leads after update
      await fetchLeads()
    } catch (error) {
      console.error(`Error updating lead status to ${newStatus}:`, error)
    }
  }

  const getStatusColor = (status) => {
    const colors = {
      New: "bg-blue-100 text-blue-800",
      Contacted: "bg-yellow-100 text-yellow-800",
      Qualified: "bg-purple-100 text-purple-800",
      "Follow-Up": "bg-indigo-100 text-indigo-800",
      Won: "bg-green-100 text-green-800",
      Lost: "bg-red-100 text-red-800",
    }
    return colors[status] || "bg-gray-100 text-gray-800"
  }

  const getPriorityColor = (priority) => {
    const colors = {
      Low: "bg-gray-100 text-gray-800",
      Medium: "bg-blue-100 text-blue-800",
      High: "bg-orange-100 text-orange-800",
      Urgent: "bg-red-100 text-red-800",
    }
    return colors[priority] || "bg-gray-100 text-gray-800"
  }

  const filteredLeads = leads.filter((lead) => {
    const matchesFilter = filter === "All" || lead.status === filter
    const matchesSearch =
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.company.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const statusCounts = leads.reduce((acc, lead) => {
    acc[lead.status] = (acc[lead.status] || 0) + 1
    return acc
  }, {})

  const handleTabClick = (status) => {
    setFilter(status)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center h-64">
          <div className="text-xl">Loading pipeline...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Sales Pipeline</h1>
          <p className="text-gray-600">Track and manage your leads through the sales process</p>
        </div>

        {/* Pipeline Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
          {Object.entries(statusCounts).map(([status, count]) => (
            <div key={status} className="bg-white p-4 rounded-lg shadow-sm border">
              <div className="text-2xl font-bold text-gray-900">{count}</div>
              <div className="text-sm text-gray-600">{status}</div>
            </div>
          ))}
        </div>

        {/* Filters and Search */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search leads by name, email, or company..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="All">All Status</option>
                <option value="New">New</option>
                <option value="Contacted">Contacted</option>
                <option value="Qualified">Qualified</option>
                <option value="Follow-Up">Follow-Up</option>
                <option value="Won">Won</option>
                <option value="Lost">Lost</option>
              </select>
            </div>
          </div>
        </div>

        {/* Leads Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="menubar">
            <ul className="flex gap-10 p-5 font-medium cursor-pointer text-xl">
              <li
                className={filter === "New" ? "text-blue-500" : ""}
                onClick={() => handleTabClick("New")}
              >
                New Leads
              </li>
              <li
                className={filter === "Contacted" ? "text-blue-500" : ""}
                onClick={() => handleTabClick("Contacted")}
              >
                Contacted Leads
              </li>
              <li
                className={filter === "Qualified" ? "text-blue-500" : ""}
                onClick={() => handleTabClick("Qualified")}
              >
                Interested Leads
              </li>
              <li
                className={filter === "Follow-Up" ? "text-blue-500" : ""}
                onClick={() => handleTabClick("Follow-Up")}
              >
                Follow-Up Leads
              </li>
              <li
                className={filter === "Won" ? "text-blue-500" : ""}
                onClick={() => handleTabClick("Won")}
              >
                Won Leads
              </li>
              <li
                className={filter === "Lost" ? "text-blue-500" : ""}
                onClick={() => handleTabClick("Lost")}
              >
                Lost Leads
              </li>
            </ul>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Lead Info
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Services
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Budget
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Priority
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                            <span className="text-sm font-medium text-gray-700">
                              {lead.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{lead.name}</div>
                          <div className="text-sm text-gray-500">{lead.company}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{lead.email}</div>
                      <div className="text-sm text-gray-500">{lead.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{lead.services || "Not specified"}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{lead.budget || "Not specified"}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(lead.status)}`}
                      >
                        {lead.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(lead.priority)}`}
                      >
                        {lead.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {lead.status === "New" ? (
                        <button
                          className="bg-blue-500 p-2 rounded-md text-white hover:bg-blue-600"
                          onClick={() => handleStatusChange(lead.id, "Contacted")}
                        >
                          Contact
                        </button>
                      ) : lead.status === "Contacted" ? (
                        <div className="flex gap-2">
                          <button
                            className="bg-purple-500 p-2 rounded-md text-white hover:bg-purple-600"
                            onClick={() => handleStatusChange(lead.id, "Qualified")}
                          >
                            Interested
                          </button>
                          <button
                            className="bg-red-500 p-2 rounded-md text-white hover:bg-red-600"
                            onClick={() => handleStatusChange(lead.id, "Lost")}
                          >
                            Lost
                          </button>
                        </div>
                      ) : lead.status === "Qualified" ? (
                        <div className="flex gap-2">
                          <button
                            className="bg-indigo-500 p-2 rounded-md text-white hover:bg-indigo-600"
                            onClick={() => handleStatusChange(lead.id, "Follow-Up")}
                          >
                            Follow-Up
                          </button>
                          <button
                            className="bg-green-500 p-2 rounded-md text-white hover:bg-green-600"
                            onClick={() => handleStatusChange(lead.id, "Won")}
                          >
                            Won
                          </button>
                          <button
                            className="bg-red-500 p-2 rounded-md text-white hover:bg-red-600"
                            onClick={() => handleStatusChange(lead.id, "Lost")}
                          >
                            Lost
                          </button>
                        </div>
                      ) : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredLeads.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-500">No leads found matching your criteria.</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ViewPipeLine