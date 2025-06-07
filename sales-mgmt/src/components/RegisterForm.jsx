import { useState } from "react"
import { auth, db } from "../firebase/firebase"
import { setDoc, doc, query, collection, where, getDocs } from "firebase/firestore"
import { useNavigate } from "react-router-dom"
import { doSignInWithGoogle } from "../firebase/auth"

const RegisterForm = ({ 
  role, 
  successRedirect, 
  accentColor, 
  requireCompanyVerification = false 
}) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    companyName: "",
    password: ""
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const navigate = useNavigate()

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    })
  }

  const checkCompanyExists = async (companyName) => {
    if (!requireCompanyVerification) return true

    try {
      const normalizedCompanyName = companyName.toLowerCase()
      const companyQuery = query(
        collection(db, "companyOwner"),
        where("companyName", "==", normalizedCompanyName)
      )
      const querySnapshot = await getDocs(companyQuery)
      return !querySnapshot.empty
    } catch (error) {
      console.error("Error checking company:", error.message)
      throw error
    }
  }

  const saveUserData = async (user) => {
    try {
      await setDoc(doc(db, role.toLowerCase().replace(" ", ""), user.uid), {
        name: formData.name || user.displayName || "Unknown",
        email: formData.email || user.email,
        phone: formData.phone || "",
        companyName: formData.companyName.toLowerCase(),
        role: role,
        uid: user.uid,
        createdAt: new Date().toISOString(),
      })
      navigate(successRedirect)
    } catch (error) {
      console.error("Error saving user data:", error.message)
      throw error
    }
  }

  const handleEmailPasswordSignup = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      if (requireCompanyVerification) {
        const companyExists = await checkCompanyExists(formData.companyName)
        if (!companyExists) {
          setError("Company not found. An owner must register this company first.")
          return
        }
      }

      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        formData.email, 
        formData.password
      )
      await saveUserData(userCredential.user)
    } catch (error) {
      console.error("Error registering user:", error.message)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignup = async () => {
    setError("")
    setGoogleLoading(true)
    try {
      if (requireCompanyVerification) {
        const companyExists = await checkCompanyExists(formData.companyName)
        if (!companyExists) {
          setError("Company not found. An owner must register this company first.")
          return
        }
      }

      const result = await doSignInWithGoogle()
      await saveUserData(result.user)
    } catch (error) {
      console.error("Error with Google signup:", error.message)
      setError(error.message)
    } finally {
      setGoogleLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-2">{role} Register</h1>
        <p className="text-gray-600 text-center mb-6">Create your {role} account</p>

        {error && (
          <p className="text-red-500 text-sm mb-4 p-3 bg-red-50 border border-red-200 rounded">
            {error}
          </p>
        )}

        {/* Google Sign Up Button */}
        <div className="mb-6">
          <button
            type="button"
            onClick={handleGoogleSignup}
            disabled={googleLoading || loading}
            className="w-full bg-white border border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
          >
            {/* Google SVG Icon */}
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              {/* ... (keep existing Google SVG paths) ... */}
            </svg>
            {googleLoading ? "Creating Account..." : "Continue with Google"}
          </button>
        </div>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or register with email</span>
          </div>
        </div>

        <form onSubmit={handleEmailPasswordSignup} className="flex flex-col gap-4">
          {/* Form Fields */}
          {role !== "Company Owner" && (
            <div>
              <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1">
                Company Name *
              </label>
              <input
                type="text"
                id="companyName"
                value={formData.companyName}
                onChange={handleInputChange}
                className={`w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-${accentColor}-500 focus:border-transparent`}
                required
                placeholder="Enter your company name"
              />
            </div>
          )}

          {/* Other form fields */}
          {["name", "phone", "email", "password"].map((field) => (
            <div key={field}>
              <label htmlFor={field} className="block text-sm font-medium text-gray-700 mb-1">
                {field.charAt(0).toUpperCase() + field.slice(1)} {field !== "phone" ? "*" : ""}
              </label>
              <input
                type={field === "password" ? "password" : field === "email" ? "email" : "text"}
                id={field}
                value={formData[field]}
                onChange={handleInputChange}
                className={`w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-${accentColor}-500 focus:border-transparent`}
                required={field !== "phone"}
                minLength={field === "password" ? 6 : undefined}
                placeholder={`Enter your ${field}`}
              />
            </div>
          ))}

          <button
            type="submit"
            disabled={loading || googleLoading}
            className={`w-full bg-${accentColor}-600 text-white py-3 rounded-lg hover:bg-${accentColor}-700 transition disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <button
              onClick={() => navigate("/login")}
              className={`text-${accentColor}-600 hover:text-${accentColor}-800 font-medium`}
              disabled={loading || googleLoading}
            >
              Sign in here
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

export default RegisterForm