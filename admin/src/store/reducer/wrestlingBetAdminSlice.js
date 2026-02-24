import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "./api";

/* =========================================
   GET ALL BETS
========================================= */
export const getAllBets = createAsyncThunk(
  "wrestlingBet/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/admin/wrestling-bets/all`);
      return data.bets;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch bets"
      );
    }
  }
);

/* =========================================
   SETTLE BET
========================================= */
export const settleBet = createAsyncThunk(
  "wrestlingBet/settle",
  async ({ team, type }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(
        `/admin/wrestling-bets/settle`,
        { team, type }
      );
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Settlement failed"
      );
    }
  }
);

/* =========================================
   DISQUALIFY BET
========================================= */
export const disqualifyBet = createAsyncThunk(
  "wrestlingBet/disqualify",
  async ({ team, type }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(
        `/admin/wrestling-bets/disqualify`,
        { team, type }
      );
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Disqualification failed"
      );
    }
  }
);

/* =========================================
   SLICE
========================================= */
const slice = createSlice({
  name: "wrestlingBetAdmin",
  initialState: {
    loading: false,
    bets: [],
    success: false,
    message: "",
    error: null,
  },
  reducers: {
    resetWrestlingBetState: (state) => {
      state.loading = false;
      state.success = false;
      state.message = "";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder

      /* GET ALL */
      .addCase(getAllBets.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllBets.fulfilled, (state, action) => {
        state.loading = false;
        state.bets = action.payload;
      })
      .addCase(getAllBets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* SETTLE */
      .addCase(settleBet.pending, (state) => {
        state.loading = true;
      })
      .addCase(settleBet.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message;

        // After settlement reload bets (recommended)
      })
      .addCase(settleBet.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* DISQUALIFY */
      .addCase(disqualifyBet.pending, (state) => {
        state.loading = true;
      })
      .addCase(disqualifyBet.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message;

        // Best Practice: Refresh bets after action
        // Or manually update status if backend returns updated bets
      })
      .addCase(disqualifyBet.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetWrestlingBetState } = slice.actions;
export default slice.reducer;