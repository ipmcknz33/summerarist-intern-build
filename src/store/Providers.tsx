"use client";

import { Provider } from "react-redux";
import { store } from "./store";
import AuthListener from "../components/AuthListener";
import AuthModal from "../components/AuthModal";
import LibraryPersist from "./LibraryPersist";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <AuthListener />
      <AuthModal />
      <LibraryPersist />
      {children}
    </Provider>
  );
}
