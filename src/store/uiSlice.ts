import { createSlice } from "@reduxjs/toolkit";

type UIState = {
  isAuthOpen: boolean;
};

const initialState: UIState = {
  isAuthOpen: false,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    openAuth(state) {
      state.isAuthOpen = true;
    },
    closeAuth(state) {
      state.isAuthOpen = false;
    },
  },
});

export const { openAuth, closeAuth } = uiSlice.actions;
export default uiSlice.reducer;