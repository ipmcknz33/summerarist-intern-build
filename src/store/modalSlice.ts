import { createSlice } from "@reduxjs/toolkit"

interface ModalState {
  isAuthOpen: boolean
}

const initialState: ModalState = {
  isAuthOpen: false,
}

const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    openAuth: (state) => {
      state.isAuthOpen = true
    },
    closeAuth: (state) => {
      state.isAuthOpen = false
    },
  },
})

export const { openAuth, closeAuth } = modalSlice.actions
export default modalSlice.reducer