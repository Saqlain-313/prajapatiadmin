import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import Spinner from "../componets/Spinner";
import { getProfile } from "./reducer/authReducer";

const PrivateRoute = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { user, isAuthenticated, loading } = useSelector((state) => state.auth);
  const [initialLoading, setInitialLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);

  // Get the actual user data (handle nested structure)
  const getActualUser = () => {
    if (!user) return null;
    // Check if user has nested user object
    return user?.user || user;
  };

  const actualUser = getActualUser();
  const userRole = actualUser?.role;

  // Debug logging
  console.log("PrivateRoute - State:", {
    loading,
    initialLoading,
    isAuthenticated,
    user: user,
    actualUser: actualUser,
    userRole: userRole,
    authChecked
  });

  useEffect(() => {
    const fetchProfile = async () => {
      // Only fetch if we haven't checked auth yet and no user data
      if (!authChecked && !user) {
        try {
          console.log("PrivateRoute - Fetching profile...");
          await dispatch(getProfile()).unwrap();
          console.log("PrivateRoute - Profile fetched successfully");
        } catch (error) {
          console.log("PrivateRoute - Not authenticated:", error);
        }
      }
      setInitialLoading(false);
      setAuthChecked(true);
    };

    fetchProfile();
  }, []);
// }, [dispatch, user, authChecked]);

  // Show spinner while loading
  if (loading || initialLoading) {
    console.log("PrivateRoute - Loading...");
    return <Spinner />;
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    console.log("PrivateRoute - Not authenticated, redirecting to login");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if user data exists
  if (!actualUser) {
    console.log("PrivateRoute - No user data, redirecting to login");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if user has valid role (admin or subadmin)
  if (userRole !== "admin" && userRole !== "subadmin") {
    console.log("PrivateRoute - Invalid role:", userRole, "redirecting to login");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  console.log("PrivateRoute - User authenticated with role:", userRole);
  
  // Render child routes
  return <Outlet />;
};

export default PrivateRoute;