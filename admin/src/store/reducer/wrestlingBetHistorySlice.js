import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "./api";

/* =========================================
   🔹 ADMIN – Get All Bets
========================================= */
export const getAllBetHistory = createAsyncThunk(
    "wrestlingBetHistory/getAll",
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await api.get(
                "/wrestling-bet-history/all",
                { withCredentials: true }
            );

            return data.bets;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message);
        }
    }
);

/* =========================================
   🔹 ADMIN – Get Bets By MID
========================================= */
export const getBetHistoryByMid = createAsyncThunk(
    "wrestlingBetHistory/getByMid",
    async (mid, { rejectWithValue }) => {
        try {
            const { data } = await api.get(
                `/wrestling-bet-history/wrestling-bets/${mid}`,
                { withCredentials: true }
            );

            return data.bets;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message);
        }
    }
);

/* =========================================
   🔥 ADMIN – Get Match Profit Summary
========================================= */
export const getMatchProfitSummary = createAsyncThunk(
    "wrestlingBetHistory/getProfitSummary",
    async (mid, { rejectWithValue }) => {
        try {
            const { data } = await api.get(
                `/wrestling-bet-history/match-profit/${mid}`,
                { withCredentials: true }
            );

            return data.data; // 👈 controller me data: result bheja tha
        } catch (error) {
            return rejectWithValue(error.response?.data?.message);
        }
    }
);

const wrestlingBetHistorySlice = createSlice({
    name: "wrestlingBetHistory",
    initialState: {
        loading: false,
        bets: [],
        profitSummary: null,   // 👈 NEW STATE
        error: null,
    },
    reducers: {
        resetBetHistory: (state) => {
            state.bets = [];
            state.profitSummary = null;  // 👈 RESET PROFIT ALSO
            state.error = null;
            state.loading = false;
        },
    },
    extraReducers: (builder) => {
        builder

            /* ================= ALL ================= */
            .addCase(getAllBetHistory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllBetHistory.fulfilled, (state, action) => {
                state.loading = false;
                state.bets = action.payload;
            })
            .addCase(getAllBetHistory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            /* ================= BY MID ================= */
            .addCase(getBetHistoryByMid.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getBetHistoryByMid.fulfilled, (state, action) => {
                state.loading = false;
                state.bets = action.payload;
            })
            .addCase(getBetHistoryByMid.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            /* ================= PROFIT SUMMARY ================= */
            .addCase(getMatchProfitSummary.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getMatchProfitSummary.fulfilled, (state, action) => {
                state.loading = false;
                state.profitSummary = action.payload;
            })
            .addCase(getMatchProfitSummary.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { resetBetHistory } = wrestlingBetHistorySlice.actions;

export default wrestlingBetHistorySlice.reducer;