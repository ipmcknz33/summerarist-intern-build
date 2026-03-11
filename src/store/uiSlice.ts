import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type AuthTab = "login" | "signup";

type UIState = {
  isAuthOpen: boolean;
  authTab: AuthTab;
};

const initialState: UIState = {
  isAuthOpen: false,
  authTab: "login",
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

    setAuthTab(state, action: PayloadAction<AuthTab>) {
      state.authTab = action.payload;
    },

    openLogin(state) {
      state.isAuthOpen = true;
      state.authTab = "login";
    },

    openSignup(state) {
      state.isAuthOpen = true;
      state.authTab = "signup";
    },
  },
});

export const { openAuth, closeAuth, setAuthTab, openLogin, openSignup } =
  uiSlice.actions;

export default uiSlice.reducer;