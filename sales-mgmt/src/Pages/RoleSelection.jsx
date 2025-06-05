"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { auth, db } from "../firebase/firebase"
import { doc, setDoc } from "firebase/firestore"

const RoleSelection = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const navigate = useNavigate()
  const user = auth.currentUser

  useEffect(() => {
    if (!user) {
      navigate("/login")
    }
  }, [user, navigate])

  const handleRoleSelection = async (role) => {
    if (!user) {
      setError("No user found. Please sign in again.")
      return
    }

    setLoading(true)
    setError("")

    try {
      let collectionName
      const userData = {
        name: user.displayName || "Unknown",
        email: user.email,
        uid: user.uid,
        createdAt: new Date().toISOString(),
      }

      switch (role) {
        case "Marketing Manager":
          collectionName = "marketingManager"
          userData.role = "Marketing Manager"
          break
        case "Sales Manager":
          collectionName = "salesManager"
          userData.role = "Sales Manager"
          break
        case "Company Owner":
          collectionName = "companyOwner"
          userData.role = "Company Owner"
          break
        default:
          throw new Error("Invalid role selected")
      }

      await setDoc(doc(db, collectionName, user.uid), userData)
      console.log(`User registered as ${role}:`, user)

      // Force a page reload to trigger auth state change
      window.location.reload()
    } catch (error) {
      console.error("Error saving user role:", error)
      setError("Failed to set user role. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return <div className="text-center p-8">Redirecting to login...</div>
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-2">Select Your Role</h1>
        <p className="text-gray-600 text-center mb-6">
          Welcome to NexaDew! Please select your role in the organization.
        </p>

        {error && <p className="text-red-500 text-sm mb-4 p-3 bg-red-50 border border-red-200 rounded">{error}</p>}

        <div className="space-y-4">
          <button
            onClick={() => handleRoleSelection("Marketing Manager")}
            disabled={loading}
            className="w-full bg-green-600 text-white py-4 rounded-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Marketing Manager
          </button>

          <button
            onClick={() => handleRoleSelection("Sales Manager")}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-4 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Sales Manager
          </button>

          <button
            onClick={() => handleRoleSelection("Company Owner")}
            disabled={loading}
            className="w-full bg-purple-600 text-white py-4 rounded-lg hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Company Owner
          </button>
        </div>

        {loading && (
          <div className="text-center mt-4">
            <p className="text-gray-600">Setting up your account...</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default RoleSelection
