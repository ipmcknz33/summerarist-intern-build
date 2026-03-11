"use client";

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type AuthUser = {
  uid: string;
  email: string | null;
};

type AuthState = {
  user: AuthUser | null;
  isPremium: boolean;
  status: "loading" | "ready";
};

const initialState: AuthState = {
  user: null,
  isPremium: false,
  status: "loading",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<AuthUser | null>) {
      state.user = action.payload;
    },
    setPremium(state, action: PayloadAction<boolean>) {
      state.isPremium = action.payload;
    },
    setAuthReady(state) {
      state.status = "ready";
    },
    resetAuth(state) {
      state.user = null;
      state.isPremium = false;
      state.status = "ready";
    },
  },
});

export const { setUser, setPremium, setAuthReady, resetAuth } =
  authSlice.actions;

export default authSlice.reducer;