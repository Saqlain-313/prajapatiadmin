import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "./api";


export const getAllBets = createAsyncThunk(
  "wrestlingBet/getAll",
  async (_, { rejectWithValue }) => {
    try {

      const { data } = await api.get(`/admin/wrestling-bets/all`, );

      return data.bets;
    } catch (err) {
      return rejectWithValue(err.response.data.message);
    }
  }
);

export const settleBet = createAsyncThunk(
  "wrestlingBet/settle",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      const { data } = await api.put(
        `/admin/wrestling-bets/settle/${id}`,
        { status },
      );

      return data.bet;
    } catch (err) {
      return rejectWithValue(err.response.data.message);
    }
  }
);

const slice = createSlice({
  name: "wrestlingBetAdmin",
  initialState: {
    loading: false,
    bets: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllBets.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllBets.fulfilled, (state, action) => {
        state.loading = false;
        state.bets = action.payload;
      })
      .addCase(settleBet.fulfilled, (state, action) => {
        const index = state.bets.findIndex(
          (b) => b._id === action.payload._id
        );
        if (index !== -1) {
          state.bets[index] = action.payload;
        }
      });
  },
});

export default slice.reducer;