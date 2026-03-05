import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type LibraryBook = {
  id: string;
  title: string;
  author: string;
  imageLink: string;
};

type LibraryState = {
  items: LibraryBook[];
};

const initialState: LibraryState = {
  items: [],
};

const librarySlice = createSlice({
  name: "library",
  initialState,
  reducers: {
    hydrateLibrary(state, action: PayloadAction<LibraryBook[]>) {
      state.items = action.payload ?? [];
    },
    addToLibrary(state, action: PayloadAction<LibraryBook>) {
      const exists = state.items.some((b) => b.id === action.payload.id);
      if (!exists) state.items.unshift(action.payload);
    },
    removeFromLibrary(state, action: PayloadAction<string>) {
      state.items = state.items.filter((b) => b.id !== action.payload);
    },
    clearLibrary(state) {
      state.items = [];
    },
  },
});

export const { hydrateLibrary, addToLibrary, removeFromLibrary, clearLibrary } =
  librarySlice.actions;

export default librarySlice.reducer;