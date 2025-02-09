import React, { createContext, useContext, useEffect, useState } from "react";
import {
  getAuth,
  signInWithPopup,
  FacebookAuthProvider,
  signOut,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import { db } from "../firebase";
import { ref, set, get } from "firebase/database";

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  signInWithFacebook: () => Promise<void>;
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
  const auth = getAuth();

  async function signInWithFacebook() {
    try {
      if (!process.env.REACT_APP_FACEBOOK_APP_ID) {
        throw new Error("Facebook App ID is not configured");
      }

      const provider = new FacebookAuthProvider();

      // Add all required scopes
      provider.addScope("email");
      provider.addScope("public_profile");
      provider.addScope("user_photos");

      // Set custom parameters
      provider.setCustomParameters({
        display: "popup",
        auth_type: "rerequest",
        client_id: process.env.REACT_APP_FACEBOOK_APP_ID,
      });

      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Get the Facebook access token
      const credential = FacebookAuthProvider.credentialFromResult(result);
      const accessToken = credential?.accessToken;

      // Construct the profile picture URL with the access token
      const photoURL = accessToken
        ? `https://graph.facebook.com/${user.providerData[0]?.uid}/picture?type=large&access_token=${accessToken}`
        : user.photoURL;

      // Save user data to Firebase Realtime Database with null checks
      const userRef = ref(db, `users/${user.uid}`);
      const userData: UserData = {
        uid: user.uid,
        name: user.displayName || "Anonymous User",
        email: user.email,
        photoURL: photoURL,
        lastLogin: new Date().toISOString(),
      };
      await set(userRef, userData);

      // Update local state
      setUserData(userData);
    } catch (error) {
      console.error("Facebook sign in error:", error);
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
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        // Fetch additional user data from Firebase
        const userRef = ref(db, `users/${user.uid}`);
        const snapshot = await get(userRef);
        if (snapshot.exists()) {
          setUserData(snapshot.val());
        }
      } else {
        setUserData(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, [auth]);

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
