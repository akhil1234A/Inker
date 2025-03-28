import { configureStore } from "@reduxjs/toolkit";
import blogEditorReducer from "./slices/blogSlice";


export const store = configureStore({
  reducer: {
    blogEditor: blogEditorReducer,
  },

});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;