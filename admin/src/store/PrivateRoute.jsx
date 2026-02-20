import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";
import Spinner from "../componets/Spinner";
import { getProfile } from "./reducer/authReducer";

const PrivateRoute = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [ok, setOk] = useState(true);
  const [loading, setLoading] = useState(true);

  // Memoize the userInfo processing to avoid unnecessary computations
  const processedUserInfo = useMemo(() => {
    return user ? user : null;
  }, [user]);

  useEffect(() => {
    if (!processedUserInfo) {
      dispatch(getProfile()).finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [dispatch, processedUserInfo]);

  useEffect(() => {
    setOk(!!processedUserInfo);
  }, [processedUserInfo]);

  if (loading) {
    return <Spinner />;
  }

  // If user is not logged in, redirect to login
  if (!ok) {
    return <Navigate to="/login" replace />;
  }

  // If user role is "user", redirect to login
  if (user?.role === "user") {
    return <Navigate to="/login" replace />;
  }

  // For admin and subadmin, allow access to protected routes
  return <Outlet />;
};

export default PrivateRoute;