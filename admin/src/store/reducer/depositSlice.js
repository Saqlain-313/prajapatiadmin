import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "./api";

/* =========================================
   🚀 GET DEPOSITS (Admin)
========================================= */
export const getDeposits = createAsyncThunk(
  "deposit/getDeposits",
  async (status, { rejectWithValue }) => {
    try {
      const query = status ? `?status=${status}` : "";

      // ✅ fixed URL
      const res = await api.get(`/deposits/getdeposits${query}`);

      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch deposits"
      );
    }
  }
);

/* =========================================
   📊 GET DEPOSIT STATS
========================================= */
export const getDepositStats = createAsyncThunk(
  "deposit/getDepositStats",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/deposits/total-deposits");
      return res.data.data; // controller se data object aa raha hai
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch deposit stats"
      );
    }
  }
);

/* =========================================
   🔄 UPDATE DEPOSIT STATUS (Approve/Reject)
========================================= */
export const updateDepositStatus = createAsyncThunk(
  "deposit/updateDepositStatus",
  async ({ id, status, remark }, { rejectWithValue }) => {
    try {
      const res = await api.put(`/deposits/update/${id}`, {
        status,
        remark,
      });

      return {
        id,
        status,
        message: res.data.message,
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Status update failed"
      );
    }
  }
);

/* =========================================
   📦 DEPOSIT SLICE
========================================= */
const depositSlice = createSlice({
  name: "deposit",
  initialState: {
    loading: false,
    updateLoading: false,
    statsLoading: false,   // ✅ new
    deposits: [],
    count: 0,
    stats: {               // ✅ new
      approved: { totalAmount: 0, totalCount: 0 },
      pending: { totalAmount: 0, totalCount: 0 },
      grandTotal: 0,
    },
    success: false,
    error: null,
  },
  reducers: {
    clearDepositError: (state) => {
      state.error = null;
    },
    resetDepositState: (state) => {
      state.loading = false;
      state.updateLoading = false;
      state.statsLoading = false;
      state.deposits = [];
      state.count = 0;
      state.stats = {
        approved: { totalAmount: 0, totalCount: 0 },
        pending: { totalAmount: 0, totalCount: 0 },
        grandTotal: 0,
      };
      state.success = false;
      state.error = null;
    },
    resetUpdateStatus: (state) => {
      state.success = false;
      state.updateLoading = false;
    },
  },
  extraReducers: (builder) => {
    builder

      /* ===============================
         GET DEPOSITS
      =============================== */
      .addCase(getDeposits.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getDeposits.fulfilled, (state, action) => {
        state.loading = false;
        state.deposits = action.payload.deposits;
        state.count = action.payload.count;
      })
      .addCase(getDeposits.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ===============================
   GET DEPOSIT STATS
=============================== */
      .addCase(getDepositStats.pending, (state) => {
        state.statsLoading = true;
      })
      .addCase(getDepositStats.fulfilled, (state, action) => {
        state.statsLoading = false;
        state.stats = action.payload;
      })
      .addCase(getDepositStats.rejected, (state, action) => {
        state.statsLoading = false;
        state.error = action.payload;
      })

      /* ===============================
         UPDATE DEPOSIT STATUS
      =============================== */
      .addCase(updateDepositStatus.pending, (state) => {
        state.updateLoading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateDepositStatus.fulfilled, (state, action) => {
        state.updateLoading = false;
        state.success = true;

        // ✅ Optimistic UI Update
        const index = state.deposits.findIndex(
          (dep) => dep._id === action.payload.id
        );

        if (index !== -1) {
          state.deposits[index].status = action.payload.status;
        }
      })
      .addCase(updateDepositStatus.rejected, (state, action) => {
        state.updateLoading = false;
        state.success = false;
        state.error = action.payload;
      });
  },
});

export const {
  clearDepositError,
  resetDepositState,
  resetUpdateStatus,
} = depositSlice.actions;

export default depositSlice.reducer;