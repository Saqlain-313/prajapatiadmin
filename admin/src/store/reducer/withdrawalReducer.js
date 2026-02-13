// src/store/reducer/withdrawalReducer.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "./api";

/* =========================
   THUNKS
========================= */

// GET ALL WITHDRAWALS (ADMIN)
export const getAllWithdrawals = createAsyncThunk(
  "withdrawal/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/withdrawal/all");
      return data.withdrawals;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Fetch failed");
    }
  }
);

// APPROVE
export const approveWithdrawal = createAsyncThunk(
  "withdrawal/approve",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/withdrawal/approve/${id}`);
      return { id, message: data.message };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Approval failed");
    }
  }
);

// REJECT
export const rejectWithdrawal = createAsyncThunk(
  "withdrawal/reject",
  async ({ id, remark }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/withdrawal/reject/${id}`, {
        remark,
      });
      return { id, message: data.message };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Rejection failed");
    }
  }
);

/* =========================
   SLICE
========================= */

const withdrawalSlice = createSlice({
  name: "withdrawal",
  initialState: {
    withdrawals: [],
    loading: false,
    error: null,
    successMessage: null,
  },
  reducers: {
    clearWithdrawalState: (state) => {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder

      // GET
      .addCase(getAllWithdrawals.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllWithdrawals.fulfilled, (state, action) => {
        state.loading = false;
        state.withdrawals = action.payload;
      })
      .addCase(getAllWithdrawals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // APPROVE
      .addCase(approveWithdrawal.fulfilled, (state, action) => {
        state.successMessage = action.payload.message;
        state.withdrawals = state.withdrawals.map((w) =>
          w._id === action.payload.id
            ? { ...w, status: "approved" }
            : w
        );
      })

      // REJECT
      .addCase(rejectWithdrawal.fulfilled, (state, action) => {
        state.successMessage = action.payload.message;
        state.withdrawals = state.withdrawals.map((w) =>
          w._id === action.payload.id
            ? { ...w, status: "rejected" }
            : w
        );
      });
  },
});

export const { clearWithdrawalState } = withdrawalSlice.actions;
export default withdrawalSlice.reducer;