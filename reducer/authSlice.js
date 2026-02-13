import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

/* =========================
   AXIOS INSTANCE
========================= */
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api",
  withCredentials: true, // 🔥 VERY IMPORTANT (cookies)
});

/* =========================
   ASYNC THUNKS
========================= */

/* REGISTER */
export const registerUser = createAsyncThunk(
  "auth/register",
  async (formData, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/user/register", formData);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Register failed");
    }
  }
);

/* LOGIN */
export const loginUser = createAsyncThunk(
  "auth/login",
  async (formData, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/user/login", formData);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Login failed");
    }
  }
);

/* GET PROFILE */
export const getProfile = createAsyncThunk(
  "auth/profile",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/user/profile");
      return data.user;
    } catch (err) {
      return rejectWithValue("Unauthorized");
    }
  }
);

/* LOGOUT */
export const logoutUser = createAsyncThunk(
  "auth/logout",
  async () => {
    await api.post("/user/logout");
    return true;
  }
);

/* FORGOT PASSWORD */
export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (email, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/user/forgot-password", { email });
      return data.message;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "OTP failed");
    }
  }
);

/* VERIFY OTP & RESET PASSWORD */
export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/user/reset-password", payload);
      return data.message;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Reset failed");
    }
  }
);

/* CHANGE PASSWORD */
export const changePassword = createAsyncThunk(
  "auth/changePassword",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/user/change-password", payload);
      return data.message;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Change failed");
    }
  }
);

/* =========================
   SLICE
========================= */
const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    loading: false,
    success: false,
    message: null,
    error: null,
    isAuthenticated: false,
  },

  reducers: {
    clearAuthState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
      state.message = null;
    },
  },

  extraReducers: (builder) => {
    builder

      .addCase(registerUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(loginUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getProfile.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(getProfile.rejected, (state) => {
        state.user = null;
        state.isAuthenticated = false;
      })

      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
      })

      /* FORGOT PASSWORD */
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.success = true;
        state.message = action.payload;
      })

      .addCase(resetPassword.fulfilled, (state, action) => {
        state.success = true;
        state.message = action.payload;
      })

      .addCase(changePassword.fulfilled, (state, action) => {
        state.success = true;
        state.message = action.payload;
      });
  },
});

export const { clearAuthState } = authSlice.actions;
export default authSlice.reducer;
