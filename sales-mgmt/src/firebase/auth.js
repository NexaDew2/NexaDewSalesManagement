import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  GoogleAuthProvider,
} from "firebase/auth"
import { auth } from "./firebase"

// Configure Google Auth Provider with proper settings
const googleProvider = new GoogleAuthProvider()
googleProvider.addScope("email")
googleProvider.addScope("profile")
googleProvider.setCustomParameters({
  prompt: "select_account", // This will show account selector
})

export const doCreateUserWithEmailAndPassword = async (email, password) => {
  return createUserWithEmailAndPassword(auth, email, password)
}

export const doSignInWithEmailAndPassword = async (email, password) => {
  return signInWithEmailAndPassword(auth, email, password)
}

// Back to popup method but with better error handling
export const doSignInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider)
    return result
  } catch (error) {
    console.error("Google sign-in error:", error)
    // Handle specific popup errors
    if (error.code === "auth/popup-blocked") {
      throw new Error("Popup was blocked. Please allow popups for this site.")
    } else if (error.code === "auth/popup-closed-by-user") {
      throw new Error("Sign-in was cancelled.")
    } else if (error.code === "auth/cancelled-popup-request") {
      throw new Error("Another sign-in popup is already open.")
    }
    throw error
  }
}

export const doSignOut = () => {
  return signOut(auth)
}
