import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:5200/api",
  // baseURL: `/api`,
  withCredentials: true,
  headers: {
    Accept: "application/json",
  },
});

export const host = "http://localhost:5200";
// export const host = "/";


api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (!(config.data instanceof FormData)) {
    config.headers["Content-Type"] = "application/json";
  } else {
    delete config.headers["Content-Type"];
  }

  return config;
});
