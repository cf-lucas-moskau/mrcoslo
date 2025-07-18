import React, { createContext, useContext, useEffect, useState } from "react";
import {
  getAuth,
  signInWithCredential,
  FacebookAuthProvider,
  signOut,
  onAuthStateChanged,
  User,
  updateProfile,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
} from "firebase/auth";
import { db } from "../firebase";
import { ref, set, get } from "firebase/database";

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  signInWithFacebook: (forceRedirect?: boolean) => Promise<void>;
  logout: () => Promise<void>;
  userData: UserData | null;
}

interface UserData {
  uid: string;
  name: string;
  email: string | null;
  photoURL: string | null;
  stravaConnected?: boolean;
  lastLogin: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialRedirectChecked, setInitialRedirectChecked] = useState(false);
  const auth = getAuth();

  // Function to check if device is mobile
  const isMobileDevice = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
  };

  // Function to handle saving user data to Firebase
  const saveUserData = async (user: User) => {
    try {
      console.log("Saving user data for:", user.uid);
      const userRef = ref(db, `users/${user.uid}`);
      const userData: UserData = {
        uid: user.uid,
        name: user.displayName || "Anonymous User",
        email: user.email,
        photoURL: user.photoURL,
        lastLogin: new Date().toISOString(),
      };
      await set(userRef, userData);
      setUserData(userData);
    } catch (error) {
      console.error("Error saving user data:", error);
      throw error;
    }
  };

  // Check for redirect result when the component mounts
  useEffect(() => {
    const checkRedirectResult = async () => {
      try {
        setLoading(true);
        console.log("Checking for redirect result...");
        const result = await getRedirectResult(auth);

        if (result) {
          // User just signed in with a redirect flow
          console.log("Redirect sign-in successful:", result.user.uid);
          await saveUserData(result.user);
        }
      } catch (error: any) {
        console.error("Redirect sign-in error:", error);
        if (error.code === "auth/account-exists-with-different-credential") {
          alert(
            "An account already exists with the same email address but different sign-in credentials. Please sign in using your original method."
          );
        } else {
          alert(`Error signing in with Facebook: ${error.message}`);
        }
      } finally {
        setInitialRedirectChecked(true);
        setLoading(false);
      }
    };

    checkRedirectResult();
  }, []);

  async function signInWithFacebook(forceRedirect?: boolean) {
    try {
      const provider = new FacebookAuthProvider();
      provider.addScope("email");
      provider.addScope("public_profile");

      // Use either forced redirect or check device type
      if (forceRedirect || isMobileDevice()) {
        console.log(
          forceRedirect
            ? "Forcing redirect flow for testing"
            : "Mobile device detected, using redirect flow"
        );
        // For mobile devices or when testing, use redirect flow
        await signInWithRedirect(auth, provider);
        // The redirect will happen here, and the rest of this function won't execute
        // The result will be caught in the useEffect hook that checks for redirect results
      } else {
        console.log("Desktop device detected, using popup flow");
        // For desktop, use a popup flow
        const result = await signInWithPopup(auth, provider);

        // The signed-in user info
        const user = result.user;
        console.log("Firebase Facebook sign-in successful:", user.uid);

        // Save the user data to our database
        await saveUserData(user);
      }
    } catch (error: any) {
      console.error("Facebook sign in error:", error);

      // Handle specific errors
      if (error.code === "auth/account-exists-with-different-credential") {
        alert(
          "An account already exists with the same email address but different sign-in credentials. Please sign in using your original method."
        );
      } else if (error.code === "auth/popup-closed-by-user") {
        console.log(
          "Sign-in popup was closed by the user before finalizing the sign-in."
        );
      } else if (error.code === "auth/cancelled-popup-request") {
        console.log("Sign-in popup request was cancelled.");
      } else if (error.code === "auth/popup-blocked") {
        alert(
          "The sign-in popup was blocked by the browser. Please allow popups for this site and try again."
        );
      } else {
        alert(`Error signing in with Facebook: ${error.message}`);
      }

      throw error;
    }
  }

  async function logout() {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  }

  useEffect(() => {
    // Don't set up the auth state listener until we've checked for redirect results
    if (!initialRedirectChecked) {
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log("Auth state changed:", user?.uid);

      if (user) {
        // If we have a user, try to fetch or create their data
        const userRef = ref(db, `users/${user.uid}`);
        const snapshot = await get(userRef);

        if (snapshot.exists()) {
          setUserData(snapshot.val());
        } else {
          await saveUserData(user);
        }
        setCurrentUser(user);
      } else {
        setCurrentUser(null);
        setUserData(null);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, [auth, initialRedirectChecked]);

  const value = {
    currentUser,
    userData,
    loading,
    signInWithFacebook,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
