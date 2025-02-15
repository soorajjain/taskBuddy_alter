import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext.tsx";
import Loader from "../components/loader/Loader.tsx";

const PrivateRoute = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) return <Loader />;
  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
