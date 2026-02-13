import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "./api";

/* =============================================
   🚀 LOGIN
============================================= */
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ mobile, password }, { rejectWithValue }) => {
    try {
      const res = await api.post(
        "/admin/login",
        { mobile, password },
        { withCredentials: true }
      );
      return res.data.user;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Login failed"
      );
    }
  }
);

/* =============================================
   🚀 LOGOUT
============================================= */
export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      await api.post("/admin/logout", {}, { withCredentials: true });
      return true;
    } catch (err) {
      return rejectWithValue("Logout failed");
    }
  }
);

/* =============================================
   🚀 GET PROFILE
============================================= */
export const getProfile = createAsyncThunk(
  "auth/getProfile",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/admin/getprofile", {
        withCredentials: true,
      });
      return res.data;
    } catch (err) {
      return rejectWithValue("Unauthorized");
    }
  }
);

/* =============================================
   🚀 GET ALL USERS (ADMIN)
============================================= */
export const getAllUsers = createAsyncThunk(
  "auth/getAllUsers",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/admin/users", {
        withCredentials: true,
      });
      return res.data.users;
    } catch (err) {
      return rejectWithValue("Failed to load users");
    }
  }
);

/* =============================================
   🚀 DELETE USER (ADMIN)
============================================= */
export const deleteUser = createAsyncThunk(
  "auth/deleteUser",
  async (userId, { rejectWithValue }) => {
    try {
      await api.delete(`/admin/users/${userId}`, {
        withCredentials: true,
      });
      return userId;
    } catch (err) {
      return rejectWithValue("Failed to delete user");
    }
  }
);

/* =============================================
   🚀 AUTH SLICE
============================================= */
const authSlice = createSlice({
  name: "auth",

  initialState: {
    user: null,
    loading: false,
    error: null,
    isAuthenticated: false,
    users: [],
  },

  reducers: {
    resetAuth: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      /* ---------------- LOGIN ---------------- */
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })

      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = action.payload;
      })

      /* ---------------- LOGOUT ---------------- */
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.users = [];
        state.isAuthenticated = false;
        state.loading = false;
        state.error = null;
      })

      /* ---------------- GET PROFILE ---------------- */
      .addCase(getProfile.pending, (state) => {
        state.loading = true;
      })

      .addCase(getProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })

      .addCase(getProfile.rejected, (state) => {
        state.loading = false;
        state.user = null;              // 🔥 VERY IMPORTANT
        state.isAuthenticated = false; // 🔥 VERY IMPORTANT
      })

      /* ---------------- GET ALL USERS ---------------- */
      .addCase(getAllUsers.pending, (state) => {
        state.loading = true;
      })

      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })

      .addCase(getAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ---------------- DELETE USER ---------------- */
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter(
          (u) => u._id !== action.payload
        );
      })

      .addCase(deleteUser.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { resetAuth } = authSlice.actions;
export default authSlice.reducer;
