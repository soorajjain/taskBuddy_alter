import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import { auth, provider } from "../firebase.ts";
import { signInWithPopup, signOut, onAuthStateChanged, User, AuthError } from "firebase/auth";
import { useNavigate } from "react-router-dom";

// Type definition for our Auth context
interface AuthContextType {
  user: User | null;
  login: () => void;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
}


const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const login = useCallback(async () => {
    try {
      await signInWithPopup(auth, provider);
      navigate("/");
    } catch (err) {
      const error = err as AuthError;
      setError(error.message);
      console.error("Error during login:", error.message);
    }
  }, [navigate]);

  const logout = useCallback(async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (err) {
      console.error("Error during logout:", err);
    }
  }, [navigate]);

  const value = useMemo(() => ({
    user,
    login,
    logout,
    isLoading,
    error
  }), [user, login, logout, isLoading, error]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to access auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
