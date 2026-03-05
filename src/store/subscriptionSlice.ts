import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface SubscriptionState {
  plan: "free" | "pro"
}

const initialState: SubscriptionState = {
  plan: "free",
}

const subscriptionSlice = createSlice({
  name: "subscription",
  initialState,
  reducers: {
    setPlan: (state, action: PayloadAction<"free" | "pro">) => {
      state.plan = action.payload
    },
  },
})

export const { setPlan } = subscriptionSlice.actions
export default subscriptionSlice.reducer