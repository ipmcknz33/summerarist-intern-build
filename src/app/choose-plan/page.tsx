"use client";

import { useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";

import { stripePromise } from "@/lib/stripe";

import { db } from "@/firebase/config";
import { addDoc, collection, onSnapshot } from "firebase/firestore";

import homeStyles from "../HomePage.module.css";

type CheckoutSessionDoc = {
  sessionId?: string;
  url?: string;
  error?: { message?: string };
};

export default function ChoosePlanPage() {
  const user = useSelector((s: RootState) => s.auth.user);

  const [loading, setLoading] = useState<"monthly" | "yearly" | null>(null);
  const [error, setError] = useState<string | null>(null);

  const monthlyPriceId = process.env.NEXT_PUBLIC_STRIPE_PRICE_MONTHLY ?? "";
  const yearlyPriceId = process.env.NEXT_PUBLIC_STRIPE_PRICE_YEARLY ?? "";

  async function startCheckout(priceId: string, plan: "monthly" | "yearly") {
    setError(null);

    if (!user?.uid) {
      setError("You must be logged in to subscribe.");
      return;
    }

    if (!priceId) {
      setError("Missing Stripe Price ID in .env.local");
      return;
    }

    setLoading(plan);

    try {
      const checkoutSessionsRef = collection(
        db,
        "customers",
        user.uid,
        "checkout_sessions",
      );

      const docRef = await addDoc(checkoutSessionsRef, {
        price: priceId,
        success_url: `${window.location.origin}/for-you`,
        cancel_url: `${window.location.origin}/choose-plan`,
        allow_promotion_codes: true,
      });

      const unsub = onSnapshot(docRef, async (snap) => {
        const data = snap.data() as CheckoutSessionDoc | undefined;
        if (!data) return;

        if (data.error?.message) {
          unsub();
          setLoading(null);
          setError(data.error.message);
          return;
        }

        // Stripe Firebase extension often returns a direct URL (best path)
        if (data.url) {
          unsub();
          window.location.assign(data.url);
          return;
        }

        // Fallback: sessionId -> redirectToCheckout
        if (data.sessionId) {
          unsub();

          const stripe = await stripePromise;
          if (!stripe) {
            setLoading(null);
            setError(
              "Stripe failed to initialize. Check NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY.",
            );
            return;
          }

          // TS-safe call (avoids the 'redirectToCheckout does not exist' type issue)
          const result = await (stripe as any).redirectToCheckout({
            sessionId: data.sessionId,
          });

          if (result?.error?.message) {
            setError(result.error.message);
          }

          setLoading(null);
        }
      });
    } catch (e: unknown) {
      console.error(e);
      setLoading(null);
      setError(e instanceof Error ? e.message : "Checkout failed.");
    }
  }

  return (
    <div className={homeStyles.container}>
      <div className={homeStyles.mainCard}>
        <div className={homeStyles.hero}>
          <div className={homeStyles.heroBadge}>Subscription</div>
          <h1 className={homeStyles.heroTitle}>Choose Plan</h1>
          <p className={homeStyles.heroSubtitle}>
            Select monthly or yearly, then you’ll be redirected to Stripe
            Checkout.
          </p>
        </div>

        <div className={homeStyles.content}>
          <div className={homeStyles.buttonRow}>
            <button
              className={homeStyles.button}
              onClick={() => startCheckout(monthlyPriceId, "monthly")}
              disabled={loading !== null}
            >
              {loading === "monthly" ? "Redirecting..." : "Choose Monthly"}
            </button>

            <button
              className={homeStyles.button}
              onClick={() => startCheckout(yearlyPriceId, "yearly")}
              disabled={loading !== null}
            >
              {loading === "yearly" ? "Redirecting..." : "Choose Yearly"}
            </button>
          </div>

          {error && <div className={homeStyles.errorBox}>{error}</div>}
        </div>
      </div>
    </div>
  );
}
