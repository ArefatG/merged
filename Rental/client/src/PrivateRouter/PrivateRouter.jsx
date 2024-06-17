import React, { useContext } from "react";
import { AuthContext } from "../context/AuthProvider.jsx";
import { Navigate, useLocation } from "react-router-dom";
import useAdmin from "../hooks/useAdmin";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  const [isAdmin, isAdminLoading] = useAdmin();
  const location = useLocation();

  if (loading || isAdminLoading) {
    return <div>Loading...</div>;
  }

  if (user) {
    if (isAdmin && location.pathname.startsWith('/dashboard')) {
      return <Navigate to="/admin-dashboard" state={{ from: location }} replace />;
    }
    return <>{children}</>;
  }

  return <Navigate to="/login" state={{ from: location }} replace />;
};

export default PrivateRoute;
