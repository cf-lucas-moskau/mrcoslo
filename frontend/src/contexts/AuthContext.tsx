import React, { createContext, useContext, useEffect, useState } from "react";
import {
  getAuth,
  signInWithCredential,
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

  // Handle Facebook OAuth response
  useEffect(() => {
    const handleFacebookResponse = async () => {
      const params = new URLSearchParams(window.location.hash.substring(1));
      const accessToken = params.get("access_token");

      if (accessToken) {
        try {
          console.log("Got Facebook access token, fetching user data");

          // Fetch user data from Facebook
          const response = await fetch(
            `https://graph.facebook.com/me?fields=id,name,email,picture.type(large)&access_token=${accessToken}`
          );
          const fbUserData = await response.json();
          console.log("Facebook user data:", fbUserData);

          // Create auth credential with additional profile data
          const credential = FacebookAuthProvider.credential(accessToken);
          const result = await signInWithCredential(auth, credential);

          // Update the user's profile with the high-res photo URL
          if (result.user && fbUserData.picture?.data?.url) {
            await saveUserData({
              ...result.user,
              photoURL: fbUserData.picture.data.url,
            });
          } else {
            await saveUserData(result.user);
          }

          console.log("Firebase sign in successful:", result.user.uid);

          // Clean up the URL
          window.history.replaceState(
            {},
            document.title,
            window.location.pathname
          );
        } catch (error) {
          console.error("Error signing in with credential:", error);
        }
      }
    };

    handleFacebookResponse();
  }, [auth]);

  async function signInWithFacebook() {
    try {
      const FB_APP_ID = process.env.REACT_APP_FACEBOOK_APP_ID;
      if (!FB_APP_ID) {
        throw new Error("Facebook App ID not configured");
      }

      const redirectUri = `${window.location.origin}${window.location.pathname}`;
      const state = Math.random().toString(36).substring(7);

      // Store state for validation
      sessionStorage.setItem("fbAuthState", state);

      const facebookAuthUrl =
        `https://www.facebook.com/v12.0/dialog/oauth?` +
        `client_id=${FB_APP_ID}` +
        `&redirect_uri=${encodeURIComponent(redirectUri)}` +
        `&state=${state}` +
        `&response_type=token` +
        `&scope=email,public_profile`;

      console.log("Redirecting to Facebook auth URL:", facebookAuthUrl);
      window.location.href = facebookAuthUrl;
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
