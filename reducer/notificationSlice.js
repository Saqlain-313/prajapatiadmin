import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

/* =========================
   AXIOS INSTANCE
========================= */
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api",
  withCredentials: true, // 🔥 cookie-based auth
});

/* =========================
   ASYNC THUNKS
========================= */

/* ADMIN → CREATE NOTIFICATION */
export const createNotification = createAsyncThunk(
  "notification/create",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/notification/create", payload);
      return data.notification;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to create notification"
      );
    }
  }
);

/* USER → GET NOTIFICATIONS */
export const getUserNotifications = createAsyncThunk(
  "notification/getUserNotifications",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/notification");
      return data.notifications;
    } catch (err) {
      return rejectWithValue("Failed to fetch notifications");
    }
  }
);

/* USER → MARK AS READ */
export const markNotificationAsRead = createAsyncThunk(
  "notification/markAsRead",
  async (notificationId, { rejectWithValue }) => {
    try {
      await api.put(`/notification/read/${notificationId}`);
      return notificationId;
    } catch (err) {
      return rejectWithValue("Failed to mark as read");
    }
  }
);

/* =========================
   SLICE
========================= */
const notificationSlice = createSlice({
  name: "notification",
  initialState: {
    notifications: [],
    loading: false,
    error: null,
    success: false,
  },

  reducers: {
    clearNotificationState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },

  extraReducers: (builder) => {
    builder

      .addCase(createNotification.pending, (state) => {
        state.loading = true;
      })
      .addCase(createNotification.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.notifications.unshift(action.payload);
      })
      .addCase(createNotification.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getUserNotifications.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUserNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload;
      })
      .addCase(getUserNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(markNotificationAsRead.fulfilled, (state, action) => {
        const id = action.payload;
        const notif = state.notifications.find((n) => n._id === id);
        if (notif) notif.isRead = true;
      });
  },
});

export const { clearNotificationState } = notificationSlice.actions;
export default notificationSlice.reducer;
