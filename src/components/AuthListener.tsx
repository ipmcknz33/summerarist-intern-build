"use client";

import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { useDispatch } from "react-redux";
import { auth } from "../firebase/auth";
import { setUser } from "../store/authSlice";

export default function AuthListener() {
  const dispatch = useDispatch();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (fbUser) => {
      dispatch(setUser(fbUser ? { uid: fbUser.uid, email: fbUser.email } : null));
    });

    return () => unsub();
  }, [dispatch]);

  return null;
}