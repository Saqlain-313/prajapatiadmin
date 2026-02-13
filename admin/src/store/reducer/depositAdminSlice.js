import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "./api";

/* GET ALL */
export const getAllDeposits = createAsyncThunk(
  "adminDeposits/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/user-deposit/admin/all");
      return data.deposits;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed");
    }
  }
);

/* UPDATE */
export const updateDepositStatus = createAsyncThunk(
  "adminDeposits/update",
  async ({ id, status, remark }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(
        `/user-deposit/admin/${id}`,
        { status, remark }
      );
      return data.deposit;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Update failed");
    }
  }
);

const depositAdminSlice = createSlice({
  name: "adminDeposits",
  initialState: {
    deposits: [],
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    clearDepositStatus: (state) => {
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllDeposits.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllDeposits.fulfilled, (state, action) => {
        state.loading = false;
        state.deposits = action.payload;
      })
      .addCase(getAllDeposits.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateDepositStatus.fulfilled, (state, action) => {
        state.success = true;
        const index = state.deposits.findIndex(
          (d) => d._id === action.payload._id
        );
        if (index !== -1) {
          state.deposits[index] = action.payload;
        }
      });
  },
});

export const { clearDepositStatus } = depositAdminSlice.actions;
export default depositAdminSlice.reducer;