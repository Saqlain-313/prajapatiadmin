import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "./api"; 

/* =========================================
   CREATE NOTIFICATION (ADMIN)
========================================= */
export const createNotification = createAsyncThunk(
  "notification/create",
  async (formData, { rejectWithValue }) => {
    try {
      const { data } = await api.post(
        "/admin/notification/create",
        formData
      );
      return data.notification;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to create notification"
      );
    }
  }
);

/* =========================================
   GET USER NOTIFICATIONS
========================================= */
export const getUserNotifications = createAsyncThunk(
  "notification/getUser",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/admin/notification/user");
      return data.notifications;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch notifications"
      );
    }
  }
);

/* =========================================
   MARK AS READ
========================================= */
export const markNotificationAsRead = createAsyncThunk(
  "notification/markRead",
  async (notificationId, { rejectWithValue }) => {
    try {
      await api.put(`/admin/notification/read/${notificationId}`);
      return notificationId;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to mark as read"
      );
    }
  }
);

/* =========================================
   SLICE
========================================= */
const notificationSlice = createSlice({
  name: "notification",
  initialState: {
    notifications: [],
    loading: false,
    createLoading: false,
    error: null,
    success: false,
  },
  reducers: {
    resetNotificationState: (state) => {
      state.loading = false;
      state.createLoading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder

      /* =========================
         CREATE NOTIFICATION
      ========================== */
      .addCase(createNotification.pending, (state) => {
        state.createLoading = true;
        state.error = null;
      })
      .addCase(createNotification.fulfilled, (state, action) => {
        state.createLoading = false;
        state.success = true;
        state.notifications.unshift(action.payload);
      })
      .addCase(createNotification.rejected, (state, action) => {
        state.createLoading = false;
        state.error = action.payload;
      })

      /* =========================
         GET USER NOTIFICATIONS
      ========================== */
      .addCase(getUserNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload;
      })
      .addCase(getUserNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* =========================
         MARK AS READ
      ========================== */
      .addCase(markNotificationAsRead.fulfilled, (state, action) => {
        const notification = state.notifications.find(
          (n) => n._id === action.payload
        );
        if (notification) {
          notification.isRead = true;
        }
      })
      .addCase(markNotificationAsRead.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { resetNotificationState } = notificationSlice.actions;
export default notificationSlice.reducer;