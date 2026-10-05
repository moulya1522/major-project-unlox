import { createContext, useContext, useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [therapist, setTherapist] = useState(() => {
    const saved = localStorage.getItem("unfazed_therapist");

    try {
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(true);

  const isAuthenticated = Boolean(localStorage.getItem("unfazed_token"));

  useEffect(() => {
    const checkAuthentication = async () => {
      const token = localStorage.getItem("unfazed_token");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await axiosInstance.get("/therapists/me");

        if (response.data?.therapist) {
          setTherapist(response.data.therapist);

          localStorage.setItem(
            "unfazed_therapist",
            JSON.stringify(response.data.therapist)
          );
        }
      } catch (error) {
        console.error("Authentication check failed:", error);

        localStorage.removeItem("unfazed_token");
        localStorage.removeItem("unfazed_therapist");
        setTherapist(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuthentication();
  }, []);

  const login = async (email, password) => {
    const response = await axiosInstance.post("/auth/login", {
      email,
      password,
    });

    const { token, therapist } = response.data;

    localStorage.setItem("unfazed_token", token);
    localStorage.setItem("unfazed_therapist", JSON.stringify(therapist));

    setTherapist(therapist);

    return response.data;
  };

  const register = async (formData) => {
    const response = await axiosInstance.post("/auth/register", formData);

    const { token, therapist } = response.data;

    localStorage.setItem("unfazed_token", token);
    localStorage.setItem("unfazed_therapist", JSON.stringify(therapist));

    setTherapist(therapist);

    return response.data;
  };

  const logout = () => {
    localStorage.removeItem("unfazed_token");
    localStorage.removeItem("unfazed_therapist");

    setTherapist(null);
  };

  return (
    <AuthContext.Provider
      value={{
        therapist,
        loading,
        isAuthenticated,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}