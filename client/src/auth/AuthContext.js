import { createContext, useContext, useEffect, useState } from "react";
import { authAPI } from "../apis/usersAPI";
import { useQuery } from "@tanstack/react-query";
import React from "react";

export const AuthContext = createContext();

// eslint-disable-next-line react/prop-types
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const { isError, isLoading, data, isSuccess } = useQuery({
    queryFn: authAPI,
    queryKey: ["checkAuth"],
  });

  useEffect(() => {
    if (isSuccess) {
      setIsAuthenticated(data);
    }
  }, [data, isSuccess]);

  const login = async () => {
    setIsAuthenticated(true);
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isError,
        isLoading,
        isSuccess,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

//----- Custom Hook For Destructuring -----
export const useAuth = () => {
  return useContext(AuthContext);
};
