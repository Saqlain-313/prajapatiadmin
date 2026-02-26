// src/store/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "./api";

/* =============================================
   🔥 LOAD FROM LOCALSTORAGE
============================================= */
const storedUser = JSON.parse(localStorage.getItem("adminUser"));
const storedToken = localStorage.getItem("adminToken");

/* =============================================
   🚀 LOGIN
============================================= */
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ mobile, password }, { rejectWithValue }) => {
    try {
      const res = await api.post("/admin/login", {
        mobile,
        password,
      });

      const { user, token } = res.data;

      localStorage.setItem("adminUser", JSON.stringify(user));
      localStorage.setItem("adminToken", token);

      return { user, token };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Login failed"
      );
    }
  }
);

/* =============================================
   🚀 GET USER BY ID
============================================= */
export const getUserById = createAsyncThunk(
  "auth/getUserById",
  async (userId, { rejectWithValue }) => {
    try {
      const res = await api.get(`/admin/users/${userId}`);
      return res.data.data; // controller me data: user bheja tha
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to load user"
      );
    }
  }
);

export const updateUser = createAsyncThunk(
  "auth/updateUser",
  async ({ userId, updateData }, { rejectWithValue }) => {
    try {
      const res = await api.patch(
        `/admin/users/${userId}`,
        updateData
      );

      return res.data.data; // controller me data: updatedUser bheja tha
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to update user"
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
      await api.post("/admin/logout");

      localStorage.removeItem("adminUser");
      localStorage.removeItem("adminToken");

      return true;
    } catch (err) {
      return rejectWithValue("Logout failed");
    }
  }
);

/* =============================================
   🚀 GET PROFILE (Auto Login on Refresh)
============================================= */
export const getProfile = createAsyncThunk(
  "auth/getProfile",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/admin/getprofile");
      return res.data;
    } catch (err) {
      return rejectWithValue("Unauthorized");
    }
  }
);

/* =============================================
   🚀 GET ALL USERS
============================================= */
export const getAllUsers = createAsyncThunk(
  "auth/getAllUsers",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/admin/users");
      return res.data.users;
    } catch (err) {
      return rejectWithValue("Failed to load users");
    }
  }
);

/* =============================================
   🚀 DELETE USER
============================================= */
export const deleteUser = createAsyncThunk(
  "auth/deleteUser",
  async (userId, { rejectWithValue }) => {
    try {
      await api.delete(`/admin/users/${userId}`);
      return userId;
    } catch (err) {
      return rejectWithValue("Failed to delete user");
    }
  }
);

/* =============================================
   🔥 AUTH SLICE
============================================= */
const authSlice = createSlice({
  name: "auth",

  initialState: {
    user: storedUser || null,
    token: storedToken || null,
    isAuthenticated: !!storedUser,
    loading: false,
    error: null,
    users: [],
    selectedUser: null, // ✅ ADD THIS
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
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.error = action.payload;
      })

      /* ---------------- GET USER BY ID ---------------- */
      .addCase(getUserById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedUser = action.payload;
      })
      .addCase(getUserById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ---------------- UPDATE USER ---------------- */
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;

        // Update selectedUser
        state.selectedUser = action.payload;

        // Update in users list if exists
        state.users = state.users.map((u) =>
          u._id === action.payload._id ? action.payload : u
        );
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ---------------- LOGOUT ---------------- */
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
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

        localStorage.setItem(
          "adminUser",
          JSON.stringify(action.payload)
        );
      })
      .addCase(getProfile.rejected, (state) => {
        state.loading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;

        localStorage.removeItem("adminUser");
        localStorage.removeItem("adminToken");
      })

      /* ---------------- GET USERS ---------------- */
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.users = action.payload;
      })

      /* ---------------- DELETE USER ---------------- */
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter(
          (u) => u._id !== action.payload
        );
      });
  },
});

export const { resetAuth } = authSlice.actions;
export default authSlice.reducer;