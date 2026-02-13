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

const wrestlingBetHistorySlice = createSlice({
    name: "wrestlingBetHistory",
    initialState: {
        loading: false,
        bets: [],
        error: null,
    },
    reducers: {
        resetBetHistory: (state) => {
            state.bets = [];
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
            });
    },
});

export const { resetBetHistory } = wrestlingBetHistorySlice.actions;

export default wrestlingBetHistorySlice.reducer;