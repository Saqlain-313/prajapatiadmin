import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "./api"

/* ================================
   GET REFERRAL SETTINGS
================================ */

export const getReferralSettings = createAsyncThunk(
  "referral/getSettings",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      const { data } = await api.get(
        "/referral/getreferral-setting",
      );

      return data.settings;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch referral settings"
      );
    }
  }
);

/* ================================
   UPDATE REFERRAL COMMISSION
================================ */

export const updateReferralSetting = createAsyncThunk(
  "referral/updateSetting",
  async ({ level, percent }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      const { data } = await api.put(
        "/referral/updatereferral-setting",
        { level, percent },
      );

      return data.setting;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to update referral commission"
      );
    }
  }
);

/* ================================
   SLICE
================================ */

const referralSettingSlice = createSlice({
  name: "referral",
  initialState: {
    loading: false,
    settings: [],
    success: false,
    error: null,
  },
  reducers: {
    resetReferralState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder

      // GET SETTINGS
      .addCase(getReferralSettings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getReferralSettings.fulfilled, (state, action) => {
        state.loading = false;
        state.settings = action.payload;
      })
      .addCase(getReferralSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // UPDATE SETTING
      .addCase(updateReferralSetting.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(updateReferralSetting.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;

        // Update locally in state
        const index = state.settings.findIndex(
          (item) => item.level === action.payload.level
        );

        if (index !== -1) {
          state.settings[index] = action.payload;
        }
      })
      .addCase(updateReferralSetting.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetReferralState } = referralSettingSlice.actions;

export default referralSettingSlice.reducer;