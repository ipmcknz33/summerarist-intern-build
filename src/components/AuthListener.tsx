"use client";

import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { useDispatch } from "react-redux";
import { auth } from "../firebase/auth";
import { setAuthReady, setPremium, setUser } from "../store/authSlice";

export default function AuthListener() {
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (fbUser) => {
      if (fbUser) {
        dispatch(
          setUser({
            uid: fbUser.uid,
            email: fbUser.email,
          })
        );
      } else {
        dispatch(setUser(null));
        dispatch(setPremium(false));
      }

      dispatch(setAuthReady());
    });

    return () => unsubscribe();
  }, [dispatch]);

  return null;
}