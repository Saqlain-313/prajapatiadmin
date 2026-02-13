import { configureStore } from "@reduxjs/toolkit";
import imageReducer from "./slices/imageSlice";
import authReducer from "./slices/authSlice";
import notificationReducer from "./slices/notificationSlice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        images: imageReducer,
        notification: notificationReducer,

    },
});
