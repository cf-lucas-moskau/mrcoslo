import React, { createContext, useContext, useEffect, useState } from "react";
import {
  getAuth,
  signInWithPopup,
  signInWithRedirect,
  FacebookAuthProvider,
  signOut,
  onAuthStateChanged,
  User,
  getRedirectResult,
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

  // Function to check if device is mobile
  const isMobileDevice = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
  };

  // Function to handle saving user data to Firebase
  const saveUserData = async (user: User, photoURL: string | null) => {
    try {
      const userRef = ref(db, `users/${user.uid}`);
      const userData: UserData = {
        uid: user.uid,
        name: user.displayName || "Anonymous User",
        email: user.email,
        photoURL: photoURL,
        lastLogin: new Date().toISOString(),
      };
      await set(userRef, userData);
      setUserData(userData);
    } catch (error) {
      console.error("Error saving user data:", error);
    }
  };

  async function signInWithFacebook() {
    try {
      if (!process.env.REACT_APP_FACEBOOK_APP_ID) {
        throw new Error("Facebook App ID is not configured");
      }

      const provider = new FacebookAuthProvider();
      provider.addScope("email");
      provider.addScope("public_profile");
      provider.addScope("user_photos");

      const isMobile = isMobileDevice();

      provider.setCustomParameters({
        display: isMobile ? "touch" : "popup",
        auth_type: "rerequest",
        client_id: process.env.REACT_APP_FACEBOOK_APP_ID,
      });

      if (isMobile) {
        console.log("Using redirect for mobile device");
        await signInWithRedirect(auth, provider);
      } else {
        console.log("Using popup for desktop");
        const result = await signInWithPopup(auth, provider);
        const credential = FacebookAuthProvider.credentialFromResult(result);
        const accessToken = credential?.accessToken;
        const photoURL = accessToken
          ? `https://graph.facebook.com/${result.user.providerData[0]?.uid}/picture?type=large&access_token=${accessToken}`
          : result.user.photoURL;

        await saveUserData(result.user, photoURL);
      }
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
    let unsubscribe: () => void;

    async function initializeAuth() {
      try {
        // First, check for redirect result
        const result = await getRedirectResult(auth);
        if (result) {
          console.log("Got redirect result:", result);
          const credential = FacebookAuthProvider.credentialFromResult(result);
          const accessToken = credential?.accessToken;
          const photoURL = accessToken
            ? `https://graph.facebook.com/${result.user.providerData[0]?.uid}/picture?type=large&access_token=${accessToken}`
            : result.user.photoURL;

          await saveUserData(result.user, photoURL);
        }

        // Then set up the auth state listener
        unsubscribe = onAuthStateChanged(auth, async (user) => {
          console.log("Auth state changed:", user?.uid);
          setCurrentUser(user);

          if (user) {
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
      } catch (error) {
        console.error("Error during auth initialization:", error);
        setLoading(false);
      }
    }

    initializeAuth();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
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
