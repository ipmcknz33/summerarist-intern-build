import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type AuthUser = {
  uid: string;
  email: string | null;
} | null;

export type AuthStatus = "loading" | "ready";

type AuthState = {
  user: AuthUser;
  status: AuthStatus;
  isPremium: boolean;
};

const initialState: AuthState = {
  user: null,
  status: "loading",
  isPremium: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<AuthUser>) {
      state.user = action.payload;
    },

    setAuthReady(state) {
      state.status = "ready";
    },

    setPremium(state, action: PayloadAction<boolean>) {
      state.isPremium = action.payload;
    },

    resetAuth(state) {
      state.user = null;
      state.status = "ready";
      state.isPremium = false;
    },
  },
});

export const { setUser, setAuthReady, setPremium, resetAuth } = authSlice.actions;
export default authSlice.reducer;