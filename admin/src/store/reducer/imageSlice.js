import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { api } from "./api"


/* =========================
   ASYNC THUNKS
========================= */

/* GET IMAGES */
export const getImages = createAsyncThunk(
  "images/get",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/images");
      return data;
    } catch (err) {
      return rejectWithValue("Failed to fetch images");
    }
  }
);

/* UPLOAD IMAGES (MULTIPLE) */
export const uploadImages = createAsyncThunk(
  "images/upload",
  async (files, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      files.forEach((file) => formData.append("images", file));

      const { data } = await api.post("/images/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      return data.images;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Image upload failed"
      );
    }
  }
);

/* UPDATE IMAGE BY INDEX */
export const updateImageByIndex = createAsyncThunk(
  "images/update",
  async ({ index, file }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("image", file);

      const { data } = await api.put(`/images/update/${index}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      return { index, image: data.updatedImage };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Image update failed"
      );
    }
  }
);

/* DELETE IMAGE BY INDEX */
export const deleteImageByIndex = createAsyncThunk(
  "images/delete",
  async (index, { rejectWithValue }) => {
    try {
      const { data } = await api.delete(`/images/delete/${index}`);
      return data.images; // backend updated images array bhej raha hai
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Image delete failed"
      );
    }
  }
);

/* =========================
   SLICE
========================= */
const imageSlice = createSlice({
  name: "images",
  initialState: {
    images: [],
    total: 0,
    loading: false,
    error: null,
    success: false,
  },

  reducers: {
    clearImageState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },

  extraReducers: (builder) => {
    builder

      /* GET IMAGES */
      .addCase(getImages.pending, (state) => {
        state.loading = true;
      })
      .addCase(getImages.fulfilled, (state, action) => {
        state.loading = false;
        state.images = action.payload.images;
        state.total = action.payload.total;
      })
      .addCase(getImages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* UPLOAD IMAGES */
      .addCase(uploadImages.pending, (state) => {
        state.loading = true;
      })
      .addCase(uploadImages.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.images = action.payload;
        state.total = action.payload.length;
      })
      .addCase(uploadImages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* UPDATE IMAGE BY INDEX */
      .addCase(updateImageByIndex.fulfilled, (state, action) => {
        const { index, image } = action.payload;
        if (state.images[index]) {
          state.images[index] = image;
        }
      })
      /* DELETE IMAGE BY INDEX */
      .addCase(deleteImageByIndex.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteImageByIndex.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.images = action.payload;
        state.total = action.payload.length;
      })
      .addCase(deleteImageByIndex.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearImageState } = imageSlice.actions;
export default imageSlice.reducer;
