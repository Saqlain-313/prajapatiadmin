import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import Spinner from "../componets/Spinner";
import { getProfile } from "./reducer/authReducer";

const PrivateRoute = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [ok, setOk] = useState(true);

  // Memoize the userInfo processing to avoid unnecessary computations
  const processedUserInfo = useMemo(() => {
    return user ? user : null;
  }, [user]);

  useEffect(() => {
    if (!processedUserInfo) {
      dispatch(getProfile());
    }
  }, [dispatch, processedUserInfo]);

  useEffect(() => {
    setOk(!!processedUserInfo);
  }, [processedUserInfo]);

  return ok ? <Outlet /> : <Spinner />;
};

export default PrivateRoute;
