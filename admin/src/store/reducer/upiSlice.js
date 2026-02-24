import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "./api";

// GET UPI
export const fetchUpi = createAsyncThunk(
  "upi/fetchUpi",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/upi");
      return data.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

// UPDATE UPI (Admin)
export const updateUpi = createAsyncThunk(
  "upi/updateUpi",
  async (formData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      const { data } = await api.put(
        "/admin/upi",
        formData,
      );

      return data.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

const upiSlice = createSlice({
  name: "upi",
  initialState: {
    loading: false,
    upi: null,
    success: false,
    error: null,
  },
  reducers: {
    resetUpiState: (state) => {
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // FETCH
      .addCase(fetchUpi.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUpi.fulfilled, (state, action) => {
        state.loading = false;
        state.upi = action.payload;
      })
      .addCase(fetchUpi.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // UPDATE
      .addCase(updateUpi.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateUpi.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.upi = action.payload;
      })
      .addCase(updateUpi.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetUpiState } = upiSlice.actions;
export default upiSlice.reducer;