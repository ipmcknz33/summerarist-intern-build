import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type AuthUser = { uid: string; email: string | null } | null;

type AuthState = {
  user: AuthUser;
  status: "loading" | "ready";
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
  state.status = "ready";

 
  if (!action.payload) state.isPremium = false;
},
    setPremium(state, action: PayloadAction<boolean>) {
      state.isPremium = action.payload;
    },
  },
});

export const { setUser, setPremium } = authSlice.actions;
export default authSlice.reducer;